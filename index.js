const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

const corsOptions = {
  origin: "http://127.0.0.1:4000", // Replace this with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:4000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const uri =
  "mongodb+srv://taurankevin245:kevin245@cluster0.lxtnm1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();

app.get("/api/data", async (req, res) => {
  try {
    const database = client.db("jekyllTest");
    const coursesCollection = database.collection("vidPdf");
    const categoriesCollection = database.collection("categories");
    const tagsCollection = database.collection("tags");

    const courses = await coursesCollection.find({}).toArray();

    // Fetch related categories and tags for each course
    for (let course of courses) {
      // Fetch category
      const category = await categoriesCollection.findOne({
        _id: course.categoryId,
      });
      course.category = category ? category.name : null;

      // Fetch tags
      const tags = await tagsCollection
        .find({ _id: { $in: course.tagIds || [] } })
        .toArray();
      course.tags = tags.map((tag) => tag.name);
      course.tagIds = course.tagIds || []; // Ensure tagIds is defined
      course.tags = course.tags || []; // Ensure tags is defined
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send(error);
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const database = client.db("jekyllTest");
    const categories = await database
      .collection("categories")
      .find({})
      .toArray();
    console.log("Categories fetched:", categories); // Debug log
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send(error);
  }
});

app.get("/api/tags", async (req, res) => {
  try {
    const database = client.db("jekyllTest");
    const tags = await database.collection("tags").find({}).toArray();
    console.log("Tags fetched:", tags); // Debug log
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
