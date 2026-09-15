const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  volume: {
    type: Number,
    required: true
  },
  issue: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  coverImage: String,
  description: String,
  publishedDate: {
    type: Date,
    default: Date.now
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

issueSchema.index({ volume: 1, issue: 1 }, { unique: true });

module.exports = mongoose.model('Issue', issueSchema);
