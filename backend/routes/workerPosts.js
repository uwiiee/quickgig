const express = require("express");
const WorkerPost = require("../models/WorkerPost");
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

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /api/workerposts — worker creates a post
router.post("/", verifyToken, async (req, res) => {
  const { description, skills, location, schedule, pay, notes, coordinates } =
    req.body;
  try {
    const post = new WorkerPost({
      description,
      skills,
      location,
      schedule,
      pay,
      notes,
      coordinates,
      postedBy: req.user.userId,
    });
    await post.save();
    const Activity = require("../models/Activity");
    await Activity.create({
      user: req.user.userId,
      type: "posted_worker",
      workerPostRef: post._id,
    });

    res.status(201).json({ message: "Worker post created!", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workerposts/suggested — suggested worker posts for clients
router.get("/suggested", verifyToken, async (req, res) => {
  try {
    const client = await User.findById(req.user.userId);
    const posts = await WorkerPost.find({ status: "open" }).populate(
      "postedBy",
      "name location jobsDone",
    );

    const scored = posts.map((post) => {
      let score = 0;

      // 1. Skill match — 40%
      const clientSkills = client.skills.map((s) => s.toLowerCase());
      const postSkills = post.skills.map((s) => s.toLowerCase());
      const matchedSkills = postSkills.filter((s) => clientSkills.includes(s));
      const skillScore =
        postSkills.length > 0 ? matchedSkills.length / postSkills.length : 0;
      score += skillScore * 0.4;

      // 2. Availability — 25%
      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const jobDays = post.schedule.map((s) =>
        s.day?.toLowerCase().slice(0, 3),
      );
      const matchedDays = jobDays.filter(
        (d) => client.availability?.[d] !== "-",
      );
      const scheduleScore =
        jobDays.length > 0 ? matchedDays.length / jobDays.length : 0;
      score += scheduleScore * 0.25;

      // 3. Jobs done — 25%
      const jobsDoneScore = Math.min((post.postedBy?.jobsDone || 0) / 50, 1);
      score += jobsDoneScore * 0.25;

      // 4. Proximity — 10%
      let proximityScore = 0;
      if (client.coordinates?.latitude && post.coordinates?.latitude) {
        const distance = getDistance(
          client.coordinates.latitude,
          client.coordinates.longitude,
          post.coordinates.latitude,
          post.coordinates.longitude,
        );
        proximityScore = Math.max(0, 1 - distance / 20);
      }
      score += proximityScore * 0.1;

      return { post, score };
    });

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .map((s) => ({ ...s.post.toObject(), score: s.score }));

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workerposts/search?query=cooking — search worker posts
router.get("/search", verifyToken, async (req, res) => {
  const { query } = req.query;
  try {
    const client = await User.findById(req.user.userId);
    const posts = await WorkerPost.find({
      status: "open",
      $or: [
        { skills: { $elemMatch: { $regex: query, $options: "i" } } },
        { location: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("postedBy", "name location jobsDone");

    const scored = posts.map((post) => {
      let score = 0;

      // 1. Skill match — 40%
      const clientSkills = client.skills.map((s) => s.toLowerCase());
      const postSkills = post.skills.map((s) => s.toLowerCase());
      const matchedSkills = postSkills.filter((s) => clientSkills.includes(s));
      const skillScore =
        postSkills.length > 0 ? matchedSkills.length / postSkills.length : 0;
      score += skillScore * 0.4;

      // 2. Schedule match — 25%
      const jobDays = post.schedule.map((s) =>
        s.day?.toLowerCase().slice(0, 3),
      );
      const matchedDays = jobDays.filter(
        (d) => client.availability?.[d] !== "-",
      );
      const scheduleScore =
        jobDays.length > 0 ? matchedDays.length / jobDays.length : 0;
      score += scheduleScore * 0.25;

      // 3. Jobs done — 25%
      const jobsDoneScore = Math.min((post.postedBy?.jobsDone || 0) / 50, 1);
      score += jobsDoneScore * 0.25;

      // 4. Proximity — 10%
      let proximityScore = 0;
      if (client.coordinates?.latitude && post.coordinates?.latitude) {
        const distance = getDistance(
          client.coordinates.latitude,
          client.coordinates.longitude,
          post.coordinates.latitude,
          post.coordinates.longitude,
        );
        proximityScore = Math.max(0, 1 - distance / 20);
      }
      score += proximityScore * 0.1;

      return { post, score };
    });

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .map((s) => ({ ...s.post.toObject(), score: s.score }));

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workerposts — get all open worker posts
router.get("/", async (req, res) => {
  try {
    const posts = await WorkerPost.find({ status: "open" })
      .populate("postedBy", "name location jobsDone")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
