const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  therapistId: { type: String, required: true },
  studentId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 