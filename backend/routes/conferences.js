const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Conference = require('../models/Conference');
const { auth, requireRole } = require('../middleware/auth');

// Setup multer for PDF upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/conferences');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `conference-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// GET all conferences
router.get('/', async (req, res) => {
  try {
    const conferences = await Conference.find().sort({ order: 1, createdAt: -1 });
    res.json(conferences);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new conference
router.post('/', auth, requireRole('admin'), upload.single('pdfFile'), async (req, res) => {
  try {
    const { title, order } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const pdfUrl = `/uploads/conferences/${req.file.filename}`;
    
    const conference = new Conference({
      title,
      pdfUrl,
      order: order ? parseInt(order) : 0
    });

    await conference.save();
    res.status(201).json(conference);
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating conference' });
  }
});

// DELETE conference
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const conference = await Conference.findById(req.params.id);
    
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    // Delete PDF file
    if (conference.pdfUrl) {
      const filePath = path.join(__dirname, '..', conference.pdfUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await conference.deleteOne();
    res.json({ message: 'Conference removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
