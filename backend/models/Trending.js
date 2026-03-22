const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trending', trendingSchema);