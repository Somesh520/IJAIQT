const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const { auth, requireRole } = require('../middleware/auth');
const { logActivity } = require('../middleware/logger');

const router = express.Router();

// Get all issues (public)
router.get('/', async (req, res) => {
  try {
    const { published } = req.query;
    const filter = published === 'true' ? { isPublished: true } : {};

    const issues = await Issue.find(filter)
      .sort({ year: -1, volume: -1, issue: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current issue (public)
router.get('/current', async (req, res) => {
  try {
    const issue = await Issue.findOne({ isCurrent: true, isPublished: true });

    if (!issue) {
      return res.status(404).json({ error: 'No current issue found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single issue (public)
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create issue (editor + admin)
router.post('/',
  auth,
  requireRole('editor', 'admin'),
  [
    body('volume').isInt({ min: 1 }),
    body('issue').isInt({ min: 1 }),
    body('year').isInt({ min: 2000 }),
    body('month').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const issue = await Issue.create(req.body);
      await logActivity(req, 'CREATE', 'Issue', issue._id, { volume: issue.volume, issue: issue.issue });

      res.status(201).json(issue);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update issue (editor + admin)
router.put('/:id',
  auth,
  requireRole('editor', 'admin'),
  async (req, res) => {
    try {
      const issue = await Issue.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      await logActivity(req, 'UPDATE', 'Issue', issue._id);

      res.json(issue);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete issue (editor + admin)
router.delete('/:id',
  auth,
  requireRole('editor', 'admin'),
  async (req, res) => {
    try {
      const issue = await Issue.findByIdAndDelete(req.params.id);

      if (!issue) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      await logActivity(req, 'DELETE', 'Issue', issue._id);

      res.json({ message: 'Issue deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
