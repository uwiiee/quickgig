const mongoose = require("mongoose");

const workerPostSchema = new mongoose.Schema({
  description: { type: String, required: true },
  skills: [{ type: String }],
  location: { type: String, required: true },
  schedule: [
    {
      date: { type: String },
      day: { type: String },
      shift: { type: String },
    },
  ],
  pay: { type: Number, default: 0 },
  notes: { type: String, default: "" },
  status: {
    type: String,
    enum: ["open", "in_progress", "taken", "completed", "cancelled"],
    default: "open",
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coordinates: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WorkerPost", workerPostSchema);
