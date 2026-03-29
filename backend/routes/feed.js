const express = require("express");
const Job = require("../models/Job");
const WorkerPost = require("../models/WorkerPost");
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

// GET /api/feed?page=1 — get mixed feed of jobs and worker posts
router.get("/", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const jobs = await Job.find({ status: "open" })
      .populate("postedBy", "name location")
      .lean();

    const workerPosts = await WorkerPost.find({ status: "open" })
      .populate("postedBy", "name location jobsDone")
      .lean();

    const jobsWithType = jobs.map((j) => ({ ...j, postType: "job" }));
    const workerPostsWithType = workerPosts.map((w) => ({
      ...w,
      postType: "workerPost",
    }));

    const merged = [...jobsWithType, ...workerPostsWithType].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = merged.length;
    const paginated = merged.slice((page - 1) * limit, page * limit);

    res.json({
      posts: paginated,
      hasMore: page * limit < total,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
