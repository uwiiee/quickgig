const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "posted_job",
      "posted_worker",
      "hired",
      "got_hired",
      "completed",
      "not_completed",
    ],
    required: true,
  },
  jobRef: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
  workerPostRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkerPost",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
