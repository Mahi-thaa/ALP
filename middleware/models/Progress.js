const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  data: { type: Object, default: {} }
});

module.exports = mongoose.model('Progress', ProgressSchema); 