const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Paper = require('../models/Paper');
const { auth, requireRole } = require('../middleware/auth');
const { logActivity } = require('../middleware/logger');

const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/papers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'paper-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Get all papers (public, with filtering)
router.get('/', async (req, res) => {
  try {
    const { issueId, search, published } = req.query;
    const filter = {};

    if (issueId) filter.issueId = issueId;
    if (published === 'true') filter.isPublished = true;
    if (search) filter.$text = { $search: search };

    const papers = await Paper.find(filter)
      .populate('issueId', 'volume issue year month')
      .sort({ publishedDate: -1 });

    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single paper (public)
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate('issueId', 'volume issue year month');

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    // Increment download count
    paper.downloadCount += 1;
    await paper.save();

    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create paper (editor + admin)
router.post('/',
  auth,
  requireRole('editor', 'admin'),
  upload.single('pdf'),
  [
    body('title').notEmpty(),
    body('abstract').notEmpty(),
    body('issueId').isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }

      const paperData = {
        ...req.body,
        pdfUrl: `/uploads/papers/${req.file.filename}`,
        authors: JSON.parse(req.body.authors || '[]'),
        keywords: JSON.parse(req.body.keywords || '[]')
      };

      const paper = await Paper.create(paperData);
      await logActivity(req, 'CREATE', 'Paper', paper._id, { title: paper.title });

      res.status(201).json(paper);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update paper (editor + admin)
router.put('/:id',
  auth,
  requireRole('editor', 'admin'),
  upload.single('pdf'),
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.pdfUrl = `/uploads/papers/${req.file.filename}`;
      }

      if (req.body.authors) {
        updateData.authors = JSON.parse(req.body.authors);
      }

      if (req.body.keywords) {
        updateData.keywords = JSON.parse(req.body.keywords);
      }

      const paper = await Paper.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!paper) {
        return res.status(404).json({ error: 'Paper not found' });
      }

      await logActivity(req, 'UPDATE', 'Paper', paper._id);

      res.json(paper);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete paper (editor + admin)
router.delete('/:id',
  auth,
  requireRole('editor', 'admin'),
  async (req, res) => {
    try {
      const paper = await Paper.findByIdAndDelete(req.params.id);

      if (!paper) {
        return res.status(404).json({ error: 'Paper not found' });
      }

      await logActivity(req, 'DELETE', 'Paper', paper._id);

      res.json({ message: 'Paper deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
