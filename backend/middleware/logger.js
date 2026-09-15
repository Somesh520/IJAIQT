const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, action, resource, resourceId = null, details = {}) => {
  try {
    if (req.user) {
      await ActivityLog.create({
        userId: req.user._id,
        action,
        resource,
        resourceId,
        details,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });
    }
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

module.exports = { logActivity };
