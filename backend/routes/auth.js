const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Review = require('../models/Review');

const router = express.Router();

router.post('/signup', async (req, res,) => {
    console.log("Signup request received:", req.body);
    const { name, email, password } = req.body;
    try {
        const user = new User({ name,email, password });
        await user.save();
        res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

// Reviews
router.post('/review', verifyToken, async (req, res) => {
  const { revieweeId, job, review } = req.body;
  try {
    const newReview = new Review({
      reviewer: req.user.userId,
      reviewee: revieweeId,
      job,
      review,
    });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reviews/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name') // ← gets reviewer's name
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;