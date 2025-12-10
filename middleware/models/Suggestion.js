const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  from: { type: String, required: true }, // parent email
  to: { type: String, required: true },   // student email
  message: { type: String, required: true },
  role: { type: String, required: true }, // 'parent'
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', suggestionSchema); 