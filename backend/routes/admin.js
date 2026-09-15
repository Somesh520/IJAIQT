const express = require('express');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { auth, requireRole } = require('../middleware/auth');
const { logActivity } = require('../middleware/logger');

const router = express.Router();

// Get all editors (admin only)
router.get('/editors',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const editors = await User.find({ role: 'editor' })
        .select('-password')
        .sort({ createdAt: -1 });

      res.json(editors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete editor (admin only)
router.delete('/editors/:id',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const editor = await User.findById(req.params.id);

      if (!editor) {
        return res.status(404).json({ error: 'Editor not found' });
      }

      if (editor.role !== 'editor') {
        return res.status(400).json({ error: 'Can only delete editor accounts' });
      }

      await User.findByIdAndDelete(req.params.id);
      await logActivity(req, 'DELETE', 'User', editor._id, { email: editor.email });

      res.json({ message: 'Editor deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get activity logs (admin only)
router.get('/logs',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { userId, resource, limit = 100 } = req.query;
      const filter = {};

      if (userId) filter.userId = userId;
      if (resource) filter.resource = resource;

      const logs = await ActivityLog.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
