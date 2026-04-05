const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, default: "" },
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
    enum: [
      "open",
      "in_progress",
      "taken",
      "completed",
      "cancelled",
      "not_completed",
    ],
    default: "open",
  },
  postedByRole: {
    type: String,
    enum: ["client", "worker"],
    default: "client",
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

module.exports = mongoose.model("Job", jobSchema);
