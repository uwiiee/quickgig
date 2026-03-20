const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who left the review
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who received the review
  job: { type: String, required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);