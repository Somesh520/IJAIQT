const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const ContactSubmission = require('../models/ContactSubmission');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many contact submissions, please try again later'
});

// Submit contact form (public, rate-limited)
router.post('/',
  contactLimiter,
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('subject').trim().notEmpty(),
    body('message').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const submission = await ContactSubmission.create({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.status(201).json({
        message: 'Your message has been sent successfully. We will get back to you soon.',
        id: submission._id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all contact submissions (editor + admin, read-only)
router.get('/',
  auth,
  requireRole('editor', 'admin'),
  async (req, res) => {
    try {
      const { status } = req.query;
      const filter = status ? { status } : {};

      const submissions = await ContactSubmission.find(filter)
        .sort({ createdAt: -1 });

      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update contact submission status (editor + admin)
router.patch('/:id/status',
  auth,
  requireRole('editor', 'admin'),
  [body('status').isIn(['new', 'read', 'replied', 'archived'])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const submission = await ContactSubmission.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
