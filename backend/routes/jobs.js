/*const express = require("express");
const Job = require("../models/Job");
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

// Haversine formula
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

// POST /api/jobs — post a new job
router.post("/", verifyToken, async (req, res) => {
  const {
    title,
    description,
    skills,
    location,
    schedule,
    pay,
    notes,
    coordinates,
  } = req.body;
  try {
    const job = new Job({
      title,
      description,
      skills,
      location,
      schedule,
      pay,
      notes,
      coordinates,
      postedBy: req.user.userId,
    });
    await job.save();
    await User.findByIdAndUpdate(req.user.userId, { $inc: { jobsPosted: 1 } });

    // Save activity
    const Activity = require("../models/Activity");
    await Activity.create({
      user: req.user.userId,
      type: "posted_job",
      jobRef: job._id,
    });

    res.status(201).json({ message: "Job posted successfully!", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/suggested — suggested jobs for worker (Jobs tab default)
router.get("/suggested", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const jobs = await Job.find({ status: "open" }).populate(
      "postedBy",
      "name location",
    );
    const scored = jobs.map((job) => {
      let score = 0;

      // 1. Skill match — 40%
      const userSkills = user.skills.map((s) => s.toLowerCase());
      const jobSkills = job.skills.map((s) => s.toLowerCase());
      const matchedSkills = jobSkills.filter((s) => userSkills.includes(s));
      const skillScore =
        jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
      score += skillScore * 0.4;

      // 2. Schedule match — 25%
      const jobDays = job.schedule.map((s) => s.day?.toLowerCase().slice(0, 3));
      const matchedDays = jobDays.filter((d) => user.availability?.[d] !== "-");
      const scheduleScore =
        jobDays.length > 0 ? matchedDays.length / jobDays.length : 0;
      score += scheduleScore * 0.25;

      // 3. Proximity — 25%
      let proximityScore = 0;
      if (user.coordinates?.latitude && job.coordinates?.latitude) {
        const distance = getDistance(
          user.coordinates.latitude,
          user.coordinates.longitude,
          job.coordinates.latitude,
          job.coordinates.longitude,
        );
        proximityScore = Math.max(0, 1 - distance / 20);
      }
      score += proximityScore * 0.25;

      // 4. Salary offer — 10%
      const maxPay = 5000;
      const salaryScore = Math.min(job.pay / maxPay, 1);
      score += salaryScore * 0.1;

      return { job, score };
    });

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .map((s) => ({ ...s.job.toObject(), score: s.score }));

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/search?query=cooking — worker searches for jobs
router.get("/search", verifyToken, async (req, res) => {
  const { query } = req.query;
  try {
    const user = await User.findById(req.user.userId);
    const jobs = await Job.find({
      status: "open",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { skills: { $elemMatch: { $regex: query, $options: "i" } } },
        { location: { $regex: query, $options: "i" } },
      ],
    }).populate("postedBy", "name location");

    const scored = jobs.map((job) => {
      let score = 0;

      // 1. Skill match — 40%
      const userSkills = user.skills.map((s) => s.toLowerCase());
      const jobSkills = job.skills.map((s) => s.toLowerCase());
      const matchedSkills = jobSkills.filter((s) => userSkills.includes(s));
      const skillScore =
        jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
      score += skillScore * 0.4;

      // 2. Schedule match — 25%
      const jobDays = job.schedule.map((s) => s.day?.toLowerCase().slice(0, 3));
      const matchedDays = jobDays.filter((d) => user.availability?.[d] !== "-");
      const scheduleScore =
        jobDays.length > 0 ? matchedDays.length / jobDays.length : 0;
      score += scheduleScore * 0.25;

      // 3. Proximity — 25%
      let proximityScore = 0;
      if (user.coordinates?.latitude && job.coordinates?.latitude) {
        const distance = getDistance(
          user.coordinates.latitude,
          user.coordinates.longitude,
          job.coordinates.latitude,
          job.coordinates.longitude,
        );
        proximityScore = Math.max(0, 1 - distance / 20);
      }
      score += proximityScore * 0.25;

      // 4. Salary offer — 10%
      const maxPay = 5000;
      const salaryScore = Math.min(job.pay / maxPay, 1);
      score += salaryScore * 0.1;

      return { job, score };
    });

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .map((s) => ({ ...s.job.toObject(), score: s.score }));

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/workers/search?query=cooking — client searches for workers
router.get("/workers/search", verifyToken, async (req, res) => {
  const { query } = req.query;
  try {
    const client = await User.findById(req.user.userId);
    const workers = await User.find({
      _id: { $ne: req.user.userId }, // exclude self
      $or: [
        { name: { $regex: query, $options: "i" } },
        { skills: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    }).select("-password");

    const scored = workers.map((worker) => {
      let score = 0;

      // 1. Skill match — 40%
      const queryLower = query.toLowerCase();
      const skillMatch = worker.skills.some((s) =>
        s.toLowerCase().includes(queryLower),
      );
      score += skillMatch ? 0.4 : 0;

      // 2. Schedule match — 25%
      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const workerAvailableDays = days.filter(
        (d) => worker.availability?.[d] !== "-",
      );
      const scheduleScore =
        workerAvailableDays.length > 0
          ? workerAvailableDays.length / days.length
          : 0;
      score += scheduleScore * 0.25;

      // 3. Jobs done — 25%
      const jobsDoneScore = Math.min(worker.jobsDone / 50, 1);
      score += jobsDoneScore * 0.25;

      // 4. Proximity — 10%
      let proximityScore = 0;
      if (client.coordinates?.latitude && worker.coordinates?.latitude) {
        const distance = getDistance(
          client.coordinates.latitude,
          client.coordinates.longitude,
          worker.coordinates.latitude,
          worker.coordinates.longitude,
        );
        proximityScore = Math.max(0, 1 - distance / 20);
      }
      score += proximityScore * 0.1;

      return { worker, score };
    });

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .map((s) => ({ ...s.worker.toObject(), score: s.score }));

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feed?page=1 — paginated feed of all open jobs
router.get("/feed", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Job.countDocuments();
    const jobs = await Job.find()
      .populate("postedBy", "name location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts: jobs.map((j) => ({ ...j.toObject(), postType: "job" })),
      hasMore: skip + jobs.length < total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs — get all open jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("postedBy", "name location")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id — get a single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name location",
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/jobs/:id/status — update job status
router.put("/:id/status", verifyToken, async (req, res) => {
  const { status } = req.body;
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!job) return res.status(404).json({ error: "Job not found" });

    const Activity = require("../models/Activity");
    const Conversation = require("../models/Conversation");

    // Find the worker from conversation
    const conv = await Conversation.findOne({ jobRef: job._id });
    const workerId = conv?.participants.find(
      (p) => p.toString() !== job.postedBy.toString(),
    );

    if (status === "taken" && workerId) {
      await Activity.create({
        user: workerId,
        type: "got_hired",
        jobRef: job._id,
      });
    }

    if (status === "completed") {
      if (workerId) {
        // Update worker activity
        await Activity.findOneAndUpdate(
          { user: workerId, jobRef: job._id },
          { type: "completed" },
        );

        // jobsDone = count of completed jobs
        const completedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "completed",
        });

        // jobCompletion = completed / (completed + not_completed)
        const notCompletedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "not_completed",
        });
        const totalFinished = completedWorkerJobs + notCompletedWorkerJobs;
        const workerCompletion =
          totalFinished > 0
            ? Math.round((completedWorkerJobs / totalFinished) * 100)
            : 100;

        await User.findByIdAndUpdate(workerId, {
          jobsDone: completedWorkerJobs,
          jobCompletion: workerCompletion,
        });
      }

      // Update client transactionCompletion
      await Activity.findOneAndUpdate(
        { user: job.postedBy, jobRef: job._id },
        { type: "completed" },
      );
      const completedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "completed",
      });
      const notCompletedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "not_completed",
      });
      const totalClientFinished = completedClientJobs + notCompletedClientJobs;
      const clientCompletion =
        totalClientFinished > 0
          ? Math.round((completedClientJobs / totalClientFinished) * 100)
          : 100;
      await User.findByIdAndUpdate(job.postedBy, {
        transactionCompletion: clientCompletion,
      });
    }

    if (status === "not_completed") {
      if (workerId) {
        // Update worker activity
        await Activity.findOneAndUpdate(
          { user: workerId, jobRef: job._id },
          { type: "not_completed" },
        );

        // jobsDone = count of completed jobs only (not_completed doesn't count)
        const completedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "completed",
        });

        // jobCompletion = completed / (completed + not_completed)
        const notCompletedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "not_completed",
        });
        const totalFinished = completedWorkerJobs + notCompletedWorkerJobs;
        const workerCompletion =
          totalFinished > 0
            ? Math.round((completedWorkerJobs / totalFinished) * 100)
            : 100;

        await User.findByIdAndUpdate(workerId, {
          jobsDone: completedWorkerJobs,
          jobCompletion: workerCompletion,
        });
      }

      // Update client transactionCompletion
      await Activity.findOneAndUpdate(
        { user: job.postedBy, jobRef: job._id },
        { type: "not_completed" },
      );
      const completedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "completed",
      });
      const notCompletedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "not_completed",
      });
      const totalClientFinished = completedClientJobs + notCompletedClientJobs;
      const clientCompletion =
        totalClientFinished > 0
          ? Math.round((completedClientJobs / totalClientFinished) * 100)
          : 100;
      await User.findByIdAndUpdate(job.postedBy, {
        transactionCompletion: clientCompletion,
      });
    }

    if (status === "open" && workerId) {
      // Cancel — remove got_hired activity from worker
      await Activity.deleteOne({
        user: workerId,
        type: "got_hired",
        jobRef: job._id,
      });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;*/

const express = require("express");
const Job = require("../models/Job");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  buildJobFeatures,
  buildWorkerFeatures,
  clusterItems,
  filterJobsBySkill,
  filterWorkersBySkill,
} = require("../utils/matching");

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

// POST /api/jobs — post a new job
router.post("/", verifyToken, async (req, res) => {
  const {
    title,
    description,
    skills,
    location,
    schedule,
    pay,
    notes,
    coordinates,
  } = req.body;

  try {
    const job = new Job({
      title,
      description,
      skills,
      location,
      schedule,
      pay,
      notes,
      coordinates,
      postedBy: req.user.userId,
    });

    await job.save();
    await User.findByIdAndUpdate(req.user.userId, { $inc: { jobsPosted: 1 } });

    const Activity = require("../models/Activity");
    await Activity.create({
      user: req.user.userId,
      type: "posted_job",
      jobRef: job._id,
    });

    res.status(201).json({ message: "Job posted successfully!", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/suggested
router.get("/suggested", verifyToken, async (req, res) => {
  try {
    const worker = await User.findById(req.user.userId);
    const jobs = await Job.find({ status: "open" }).populate(
      "postedBy",
      "name location",
    );

    const clustered = clusterItems(
      jobs,
      (job) => buildJobFeatures(job, worker),
      3,
    );

    res.json(
      clustered.map((entry) => ({
        ...entry.item.toObject(),
        cluster: entry.cluster,
        score: entry.score,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/search?query=cooking
router.get("/search", verifyToken, async (req, res) => {
  const { query = "" } = req.query;

  try {
    const worker = await User.findById(req.user.userId);
    const jobs = await Job.find({ status: "open" }).populate(
      "postedBy",
      "name location",
    );

    const filteredJobs = filterJobsBySkill(jobs, query);

    const clustered = clusterItems(
      filteredJobs,
      (job) => buildJobFeatures(job, worker, query),
      3,
    );

    res.json(
      clustered.map((entry) => ({
        ...entry.item.toObject(),
        cluster: entry.cluster,
        score: entry.score,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/workers/search?query=cooking
router.get("/workers/search", verifyToken, async (req, res) => {
  const { query = "" } = req.query;

  try {
    const client = await User.findById(req.user.userId);
    const workers = await User.find({
      _id: { $ne: req.user.userId },
    }).select("-password");

    const filteredWorkers = filterWorkersBySkill(workers, query);

    const clustered = clusterItems(
      filteredWorkers,
      (worker) => buildWorkerFeatures(worker, client, query),
      3,
    );

    res.json(
      clustered.map((entry) => ({
        ...entry.item.toObject(),
        cluster: entry.cluster,
        score: entry.score,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feed?page=1 — paginated feed of all open jobs
router.get("/feed", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Job.countDocuments();
    const jobs = await Job.find()
      .populate("postedBy", "name location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts: jobs.map((j) => ({ ...j.toObject(), postType: "job" })),
      hasMore: skip + jobs.length < total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("postedBy", "name location")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name location",
    );
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/jobs/:id/status
router.put("/:id/status", verifyToken, async (req, res) => {
  const { status } = req.body;

  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!job) return res.status(404).json({ error: "Job not found" });

    const Activity = require("../models/Activity");
    const Conversation = require("../models/Conversation");

    const conv = await Conversation.findOne({ jobRef: job._id });
    const workerId = conv?.participants.find(
      (p) => p.toString() !== job.postedBy.toString(),
    );

    if (status === "taken" && workerId) {
      await Activity.create({
        user: workerId,
        type: "got_hired",
        jobRef: job._id,
      });
    }

    if (status === "completed") {
      if (workerId) {
        await Activity.findOneAndUpdate(
          { user: workerId, jobRef: job._id },
          { type: "completed" },
        );

        const completedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "completed",
        });

        const notCompletedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "not_completed",
        });

        const totalFinished = completedWorkerJobs + notCompletedWorkerJobs;
        const workerCompletion =
          totalFinished > 0
            ? Math.round((completedWorkerJobs / totalFinished) * 100)
            : 100;

        await User.findByIdAndUpdate(workerId, {
          jobsDone: completedWorkerJobs,
          jobCompletion: workerCompletion,
        });
      }

      await Activity.findOneAndUpdate(
        { user: job.postedBy, jobRef: job._id },
        { type: "completed" },
      );

      const completedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "completed",
      });

      const notCompletedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "not_completed",
      });

      const totalClientFinished = completedClientJobs + notCompletedClientJobs;
      const clientCompletion =
        totalClientFinished > 0
          ? Math.round((completedClientJobs / totalClientFinished) * 100)
          : 100;

      await User.findByIdAndUpdate(job.postedBy, {
        transactionCompletion: clientCompletion,
      });
    }

    if (status === "not_completed") {
      if (workerId) {
        await Activity.findOneAndUpdate(
          { user: workerId, jobRef: job._id },
          { type: "not_completed" },
        );

        const completedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "completed",
        });

        const notCompletedWorkerJobs = await Activity.countDocuments({
          user: workerId,
          type: "not_completed",
        });

        const totalFinished = completedWorkerJobs + notCompletedWorkerJobs;
        const workerCompletion =
          totalFinished > 0
            ? Math.round((completedWorkerJobs / totalFinished) * 100)
            : 100;

        await User.findByIdAndUpdate(workerId, {
          jobsDone: completedWorkerJobs,
          jobCompletion: workerCompletion,
        });
      }

      await Activity.findOneAndUpdate(
        { user: job.postedBy, jobRef: job._id },
        { type: "not_completed" },
      );

      const completedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "completed",
      });

      const notCompletedClientJobs = await Job.countDocuments({
        postedBy: job.postedBy,
        status: "not_completed",
      });

      const totalClientFinished = completedClientJobs + notCompletedClientJobs;
      const clientCompletion =
        totalClientFinished > 0
          ? Math.round((completedClientJobs / totalClientFinished) * 100)
          : 100;

      await User.findByIdAndUpdate(job.postedBy, {
        transactionCompletion: clientCompletion,
      });
    }

    if (status === "open" && workerId) {
      await Activity.deleteOne({
        user: workerId,
        type: "got_hired",
        jobRef: job._id,
      });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
