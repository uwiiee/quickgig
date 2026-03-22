const mongoose = require('mongoose');
 
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  location: { type: String, required: true },
  date: { type: Date, default: null },
  timeRange: {
    start: { type: String, default: '' },
    end: { type: String, default: '' },
  },
  pay: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  schedule: {
    mon: { type: String, default: '-' },
    tue: { type: String, default: '-' },
    wed: { type: String, default: '-' },
    thu: { type: String, default: '-' },
    fri: { type: String, default: '-' },
    sat: { type: String, default: '-' },
    sun: { type: String, default: '-' },
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'taken', 'completed', 'cancelled'],
    default: 'open'
  },
  postedByRole: {
    type: String,
    enum: ['client', 'worker'],
    default: 'client'
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coordinates: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});
 
module.exports = mongoose.model('Job', jobSchema);