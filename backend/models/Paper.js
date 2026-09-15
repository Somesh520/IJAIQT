const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  authors: [{
    name: String,
    affiliation: String,
    email: String
  }],
  abstract: {
    type: String,
    required: true
  },
  keywords: [String],
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  doi: String,
  pages: {
    start: Number,
    end: Number
  },
  submittedDate: Date,
  acceptedDate: Date,
  publishedDate: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0
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

paperSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });

module.exports = mongoose.model('Paper', paperSchema);
