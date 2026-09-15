const express = require('express');
const { body, validationResult } = require('express-validator');
const EditorialBoard = require('../models/EditorialBoard');
const { auth, requireRole } = require('../middleware/auth');
const { logActivity } = require('../middleware/logger');

const router = express.Router();

// Get all board members (public, active only)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };

    const members = await EditorialBoard.find(filter).sort({ order: 1, name: 1 });

    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create board member (admin only)
router.post('/',
  auth,
  requireRole('admin'),
  [
    body('name').notEmpty(),
    body('position').notEmpty(),
    body('affiliation').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const member = await EditorialBoard.create(req.body);
      await logActivity(req, 'CREATE', 'EditorialBoard', member._id, { name: member.name });

      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update board member (admin only)
router.put('/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const member = await EditorialBoard.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!member) {
        return res.status(404).json({ error: 'Board member not found' });
      }

      await logActivity(req, 'UPDATE', 'EditorialBoard', member._id);

      res.json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete board member (admin only)
router.delete('/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const member = await EditorialBoard.findByIdAndDelete(req.params.id);

      if (!member) {
        return res.status(404).json({ error: 'Board member not found' });
      }

      await logActivity(req, 'DELETE', 'EditorialBoard', member._id);

      res.json({ message: 'Board member deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
