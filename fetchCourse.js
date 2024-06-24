require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Load environment variables
const MONGODB_URI =
  "mongodb+srv://taurankevin245:kevin245@cluster0.lxtnm1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "jekyllTest";
const COLLECTION_NAME = "testdb";

// Define course schema
const courseSchema = new mongoose.Schema({
  name: String,
  description: String,
  slug: String,
});

// Create course model
const Course = mongoose.model("Course", courseSchema);

// Connect to MongoDB Atlas
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    // Generate course pages after successful connection
    generateCoursePages();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// Function to fetch courses from MongoDB Atlas
async function fetchCourses() {
  try {
    const courses = await Course.find();
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// Function to generate course pages
async function generateCoursePages() {
  const courses = await fetchCourses();

  fs.readFile("_layouts/course.html", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading course template:", err);
      return;
    }

    courses.forEach((course) => {
      const coursePage = data
        .replace(/{{ course.name }}/g, course.name)
        .replace(/{{ course.description }}/g, course.description);

      const outputPath = path.join("_courses", `${course.slug}.html`);
      fs.writeFile(outputPath, coursePage, (err) => {
        if (err) {
          console.error(`Error writing course page for ${course.name}:`, err);
          return;
        }
        console.log(`Course page generated for ${course.name}`);
      });
    });
  });
}
