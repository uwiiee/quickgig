const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Review = require("../models/Review");

const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body);
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

// Reviews
router.post("/review", verifyToken, async (req, res) => {
  const { revieweeId, job, review } = req.body;
  try {
    const newReview = new Review({
      reviewer: req.user.userId,
      reviewee: revieweeId,
      job,
      review,
    });
    await newReview.save();
    res.status(201).json({ message: "Review submitted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/reviews/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name") //gets reviewer's name
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const Trending = require("../models/Trending");

// Save/increment a trending keyword
router.post("/trending", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword?.trim()) return res.status(400).json({ error: "No keyword" });
  try {
    await Trending.findOneAndUpdate(
      { keyword: keyword.toLowerCase() },
      { $inc: { count: 1 }, updatedAt: Date.now() },
      { upsert: true },
    );
    res.json({ message: "Trending updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top 10 trending keywords
router.get("/trending", async (req, res) => {
  try {
    const trending = await Trending.find().sort({ count: -1 }).limit(10);
    res.json(trending.map((t) => t.keyword));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search users by name or skill
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query?.trim()) return res.json([]);
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { skills: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    })
      .select("-password")
      .limit(5);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user coordinates
router.put("/coordinates", verifyToken, async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { coordinates: { latitude, longitude } },
      { new: true },
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user location
router.put("/location", verifyToken, async (req, res) => {
  const { location } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { location },
      { new: true },
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user skills
router.put("/skills", verifyToken, async (req, res) => {
  const { skills } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { skills },
      { new: true },
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update availability
router.put("/availability", verifyToken, async (req, res) => {
  const { availability } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { availability },
      { new: true },
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID (for profile viewing)
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);

module.exports = router;
