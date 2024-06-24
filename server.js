const express = require("express");
const mongoose = require("mongoose");
const Course = require("./course"); // Mengimpor model Course
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // Gunakan middleware CORS

mongoose.connect(
  "mongodb+srv://taurankevin245:kevin245@cluster0.lxtnm1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(express.json());

app.get("/api/data", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/data", async (req, res) => {
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    videoUrl: req.body.videoUrl,
    pdfUrl: req.body.pdfUrl,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/api/data/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.body.title != null) {
      course.title = req.body.title;
    }
    if (req.body.description != null) {
      course.description = req.body.description;
    }
    if (req.body.videoUrl != null) {
      course.videoUrl = req.body.videoUrl;
    }
    if (req.body.pdfUrl != null) {
      course.pdfUrl = req.body.pdfUrl;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
