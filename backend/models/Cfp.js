const mongoose = require('mongoose');

const cfpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topics: [String],
  deadlines: {
    submission: Date,
    revision: Date,
    camera_ready: Date,
    notification: Date
  },
  guidelines: String,
  contactEmail: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cfp', cfpSchema);
