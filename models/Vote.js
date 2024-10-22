const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  candidate: {
    type: String,
    required: true,
    enum: ['Plump', 'Parris']
  },
  ip: {
    type: String,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vote', voteSchema);