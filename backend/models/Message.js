const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["text", "application", "hire_request", "system"],
    default: "text",
  },
  content: { type: String, default: "" },
  applicationData: {
    skills: [{ type: String }],
    jobsDone: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    jobCompletion: { type: Number, default: 0 },
    availability: { type: Object, default: {} },
    jobDescription: { type: String, default: "" },
    jobSkills: [{ type: String }],
    jobPay: { type: Number, default: 0 },
    jobLocation: { type: String, default: "" },
    workerLocation: { type: String, default: "" },
    clientName: { type: String, default: "" },
    workerName: { type: String, default: "" },
    cancelled: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    notCompleted: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
