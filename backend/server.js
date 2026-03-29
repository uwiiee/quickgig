require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

const workerPostRoutes = require("./routes/workerPosts");
app.use("/api/workerposts", workerPostRoutes);

const feedRoutes = require("./routes/feed");
app.use("/api/feed", feedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);
