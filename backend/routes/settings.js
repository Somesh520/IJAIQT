const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SiteSettings = require('../models/SiteSettings');
const { auth, requireRole } = require('../middleware/auth');
const { logActivity } = require('../middleware/logger');

const router = express.Router();

// Ensure banner directory exists
const bannerDir = path.join(__dirname, '../uploads/banner');
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

// Configure multer for banner uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/banner/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update all settings (admin only)
router.put('/',
  auth,
  requireRole('admin'),
  upload.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'sideBannerImage', maxCount: 1 },
    { name: 'indexingImages', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const settings = await SiteSettings.getSettings();
      
      // Handle file uploads
      if (req.files) {
        if (req.files['bannerImage']) {
          settings.bannerImageUrl = `/uploads/banner/${req.files['bannerImage'][0].filename}`;
        }
        if (req.files['sideBannerImage']) {
          settings.sideBannerUrl = `/uploads/banner/${req.files['sideBannerImage'][0].filename}`;
        }
        
        let existingIndexingImages = [];
        if (req.body.keptIndexingImages) {
          try {
            existingIndexingImages = JSON.parse(req.body.keptIndexingImages);
          } catch(e) {
            console.error("Failed to parse keptIndexingImages", e);
          }
        } else {
          existingIndexingImages = settings.indexingImages || [];
        }

        let newIndexingImages = [];
        if (req.files['indexingImages']) {
          newIndexingImages = req.files['indexingImages'].map(f => `/uploads/banner/${f.filename}`);
        }

        if (req.body.keptIndexingImages !== undefined || newIndexingImages.length > 0) {
          settings.indexingImages = [...existingIndexingImages, ...newIndexingImages];
        }
      }

      // Handle other fields
      const updateableFields = [
        'bannerImageUrl', 'sideBannerUrl', 'themeColor',
        'homeWelcomeTitle', 'homeWelcomeText',
        'scopeTitle', 'scopeText',
        'sideButton1Text', 'sideButton1Url',
        'sideButton2Text', 'sideButton2Url',
        'footerText',
        'editorialBoardHtml', 'callForPapersHtml',
        'authorsHtml', 'topicsHtml',
        'faqHtml', 'currentIssueHtml'
      ];

      for (const field of updateableFields) {
        if (req.body[field] !== undefined) {
          settings[field] = req.body[field];
        }
      }

      // Handle newsLinks separately because it's a JSON array
      if (req.body.newsLinks) {
        try {
          const parsedLinks = JSON.parse(req.body.newsLinks);
          settings.newsLinks = parsedLinks;
        } catch (e) {
          console.error("Failed to parse newsLinks", e);
        }
      }

      settings.updatedAt = Date.now();
      await settings.save();

      await logActivity(req, 'UPDATE', 'Settings', settings._id, { action: 'Updated site settings' });

      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
