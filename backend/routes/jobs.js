const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
 
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
 
// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
 
// POST /api/jobs — post a new job
router.post('/', verifyToken, async (req, res) => {
  const { title, description, skills, location, schedule, pay, coordinates } = req.body;
  try {
    const job = new Job({
      title,
      description,
      skills,
      location,
      schedule,
      pay,
      coordinates,
      postedBy: req.user.userId,
    });
    await job.save();
    await User.findByIdAndUpdate(req.user.userId, { $inc: { jobsPosted: 1 } });
    res.status(201).json({ message: 'Job posted successfully!', job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/jobs/suggested — suggested jobs for worker (Jobs tab default)
router.get('/suggested', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const jobs = await Job.find({ status: 'open' }).populate('postedBy', 'name location');
 
    const scored = jobs.map(job => {
      let score = 0;
 
      // 1. Skill match — 40%
      const userSkills = user.skills.map(s => s.toLowerCase());
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const matchedSkills = jobSkills.filter(s => userSkills.includes(s));
      const skillScore = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
      score += skillScore * 0.4;
 
      // 2. Schedule match — 25%
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      const requiredDays = days.filter(d => job.schedule?.[d] !== '-');
      const matchedDays = requiredDays.filter(d => user.availability?.[d] !== '-');
      const scheduleScore = requiredDays.length > 0 ? matchedDays.length / requiredDays.length : 0;
      score += scheduleScore * 0.25;
 
      // 3. Proximity — 25%
      let proximityScore = 0;
      if (user.coordinates?.latitude && job.coordinates?.latitude) {
        const distance = getDistance(
          user.coordinates.latitude, user.coordinates.longitude,
          job.coordinates.latitude, job.coordinates.longitude
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
      .map(s => ({ ...s.job.toObject(), score: s.score }));
 
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/jobs/search?query=cooking — worker searches for jobs
router.get('/search', verifyToken, async (req, res) => {
  const { query } = req.query;
  try {
    const user = await User.findById(req.user.userId);
    const jobs = await Job.find({
      status: 'open',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { skills: { $elemMatch: { $regex: query, $options: 'i' } } },
        { location: { $regex: query, $options: 'i' } },
      ]
    }).populate('postedBy', 'name location');
 
    const scored = jobs.map(job => {
      let score = 0;
 
      // 1. Skill match — 40%
      const userSkills = user.skills.map(s => s.toLowerCase());
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const matchedSkills = jobSkills.filter(s => userSkills.includes(s));
      const skillScore = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
      score += skillScore * 0.4;
 
      // 2. Schedule match — 25%
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      const requiredDays = days.filter(d => job.schedule?.[d] !== '-');
      const matchedDays = requiredDays.filter(d => user.availability?.[d] !== '-');
      const scheduleScore = requiredDays.length > 0 ? matchedDays.length / requiredDays.length : 0;
      score += scheduleScore * 0.25;
 
      // 3. Proximity — 25%
      let proximityScore = 0;
      if (user.coordinates?.latitude && job.coordinates?.latitude) {
        const distance = getDistance(
          user.coordinates.latitude, user.coordinates.longitude,
          job.coordinates.latitude, job.coordinates.longitude
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
      .map(s => ({ ...s.job.toObject(), score: s.score }));
 
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/jobs/workers/search?query=cooking — client searches for workers
router.get('/workers/search', verifyToken, async (req, res) => {
  const { query } = req.query;
  try {
    const client = await User.findById(req.user.userId);
    const workers = await User.find({
      _id: { $ne: req.user.userId }, // exclude self
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { skills: { $elemMatch: { $regex: query, $options: 'i' } } },
      ]
    }).select('-password');
 
    const scored = workers.map(worker => {
      let score = 0;
 
      // 1. Skill match — 40%
      const queryLower = query.toLowerCase();
      const skillMatch = worker.skills.some(s => s.toLowerCase().includes(queryLower));
      score += skillMatch ? 0.4 : 0;
 
      // 2. Schedule match — 25%
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      const workerAvailableDays = days.filter(d => worker.availability?.[d] !== '-');
      const scheduleScore = workerAvailableDays.length > 0
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
          client.coordinates.latitude, client.coordinates.longitude,
          worker.coordinates.latitude, worker.coordinates.longitude
        );
        proximityScore = Math.max(0, 1 - distance / 20);
      }
      score += proximityScore * 0.1;
 
      return { worker, score };
    });
 
    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .map(s => ({ ...s.worker.toObject(), score: s.score }));
 
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/jobs — get all open jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate('postedBy', 'name location')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;