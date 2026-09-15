const express = require('express');
const { body, validationResult } = require('express-validator');
const Cfp = require('../models/Cfp');
const { auth, requireRole } = require('../middleware/auth');
const { logActivity } = require('../middleware/logger');

const router = express.Router();

// Get all CFPs (public, active only for public)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };

    const cfps = await Cfp.find(filter).sort({ createdAt: -1 });

    res.json(cfps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single CFP (public)
router.get('/:id', async (req, res) => {
  try {
    const cfp = await Cfp.findById(req.params.id);

    if (!cfp) {
      return res.status(404).json({ error: 'CFP not found' });
    }

    res.json(cfp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create CFP (editor + admin)
router.post('/',
  auth,
  requireRole('editor', 'admin'),
  [
    body('title').notEmpty(),
    body('description').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const cfp = await Cfp.create(req.body);
      await logActivity(req, 'CREATE', 'Cfp', cfp._id, { title: cfp.title });

      res.status(201).json(cfp);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update CFP (editor + admin)
router.put('/:id',
  auth,
  requireRole('editor', 'admin'),
  async (req, res) => {
    try {
      req.body.updatedAt = new Date();

      const cfp = await Cfp.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!cfp) {
        return res.status(404).json({ error: 'CFP not found' });
      }

      await logActivity(req, 'UPDATE', 'Cfp', cfp._id);

      res.json(cfp);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete CFP (editor + admin)
router.delete('/:id',
  auth,
  requireRole('editor', 'admin'),
  async (req, res) => {
    try {
      const cfp = await Cfp.findByIdAndDelete(req.params.id);

      if (!cfp) {
        return res.status(404).json({ error: 'CFP not found' });
      }

      await logActivity(req, 'DELETE', 'Cfp', cfp._id);

      res.json({ message: 'CFP deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
