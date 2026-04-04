const express = require("express");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// GET /api/conversations — get all conversations for current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate("participants", "name location")
      .sort({ lastMessageAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversations — create or get existing conversation
router.post("/", verifyToken, async (req, res) => {
  const { recipientId, jobRef, workerPostRef } = req.body;
  try {
    // Check if conversation already exists between these two users for this job
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.userId, recipientId] },
      ...(jobRef && { jobRef }),
      ...(workerPostRef && { workerPostRef }),
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.userId, recipientId],
        jobRef: jobRef || null,
        workerPostRef: workerPostRef || null,
      });
      await conversation.save();
    }

    await conversation.populate("participants", "name location");
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/:id/messages — get messages for a conversation
router.get("/:id/messages", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id })
      .populate("sender", "name")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversations/:id/messages — send a message
router.post("/:id/messages", verifyToken, async (req, res) => {
  const { type, content, applicationData } = req.body;
  try {
    const message = new Message({
      conversationId: req.params.id,
      sender: req.user.userId,
      type: type || "text",
      content: content || "",
      applicationData: applicationData || {},
    });
    await message.save();
    await message.populate("sender", "name");

    // Update conversation last message
    await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage:
        type === "application"
          ? "📋 Sent an application"
          : type === "hire_request"
            ? "🤝 Sent a hire request"
            : content,
      lastMessageAt: new Date(),
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
