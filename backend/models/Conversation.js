const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  jobRef: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
  workerPostRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkerPost",
    default: null,
  },
  lastMessage: { type: String, default: "" },
  lastMessageAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", conversationSchema);
