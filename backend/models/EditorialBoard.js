const mongoose = require('mongoose');

const editorialBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  affiliation: {
    type: String,
    required: true
  },
  email: String,
  photo: String,
  bio: String,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EditorialBoard', editorialBoardSchema);
