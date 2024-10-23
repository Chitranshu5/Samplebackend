import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./model/db.js";
import { PdfModel } from "./model/pdf.model.js";
import { Post } from "./model/post.model.js";
import { responseHelper } from "./util/helper.js";
import { SyllabusModel } from "./model/sysllabus.model.js";
import { StudyMaterialModel } from "./model/study.model.js";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

configDotenv();
// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server

connectToDatabase(); // Connect to MongoDB

// Set up Express app

app.use(cors());

// Set up multer for handling file uploads

// API to fetch all PDFs from MongoDB
app.get("/getPdfs", async (req, res) => {
  try {
    const pdfs = await PdfModel.find(); // Fetch all PDF records
    res.status(200).json({ success: true, data: pdfs });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.get("/allPost", async (req, res) => {
  try {
    const posts = await Post.find();
    responseHelper(res, 202, true, "Data fetched", { data: posts });
  } catch (error) {
    responseHelper(res, 505, false, "Error in posts api ", {
      error: error.message,
    });
    console.log(error.message);
  }
});


app.get("/singlePost/:id", async (req, res) => {
  try {
    const postId = req.params.id; // get the id from the request parameters
    const post = await Post.findById(postId); // find the post by ID

    if (!post) {
      return responseHelper(res, 404, false, "Post not found");
    }

    responseHelper(res, 202, true, "Post fetched", { data: post });
  } catch (error) {
    responseHelper(res, 505, false, "Error in single post API", {
      error: error.message,
    });
    console.log(error.message);
  }
});


app.post("/posts/:postId/:type", async (req, res) => {
  try {
    const { postId, type } = req.params;

    // Validate the type (it should be either 'like' or 'dislike')
    if (type !== "like" && type !== "dislike") {
      return responseHelper(res, 400, false, "Invalid type. Use 'like' or 'dislike'.");
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return responseHelper(res, 404, false, "Post not found.");
    }

    // Increment either 'like' or 'dislike' field
    if (type === "like") {
      post.likes = (post.likes || 0) + 1; // Increment the 'likes' field by 1
    } else if (type === "dislike") {
      post.dislikes = (post.dislikes || 0) + 1; // Increment the 'dislikes' field by 1
    }

    // Save the updated post
    await post.save();

    responseHelper(res, 202, true, `${type} count updated`, { data: post });
  } catch (error) {
    responseHelper(res, 505, false, "Error in updating post", {
      error: error.message,
    });
    console.log(error.message);
  }
});



app.get("/fetchCategory", async (req, res) => {
  try {
    const categories = await Post.distinct("category"); // Fetch all categories from the database

    if (!categories || categories.length === 0) {
      return responseHelper(res, 404, false, "No categories found.");
    }

    responseHelper(res, 202, true, "Categories fetched successfully", { data: categories });
  } catch (error) {
    responseHelper(res, 505, false, "Error in fetching categories", {
      error: error.message,
    });
    console.log(error.message);
  }
});


app.get("/getStudyMaterials/:stream/:branch/:branchYear", async (req, res) => {
  try {
    const { stream, branch, branchYear } = req.params; // Extract path parameters

    // Validate parameters
    if (!stream || !branch || !branchYear) {
      return res.status(400).json({
        success: false,
        message: "All parameters (stream, branch, branchYear) are required.",
      });
    }

    let query = { stream, branchYear };

    // Include branch if the stream isn't B.Tech or branchYear isn't First Year
    if (!(stream === "B.Tech" && branchYear === "First Year")) {
      query.branch = branch;
    }

    // Fetch study materials from the database based on the query
    const studyMaterials = await StudyMaterialModel.find(query);

    // Check if study materials were found
    if (!studyMaterials.length) {
      return res.status(404).json({
        success: false,
        message: "No study materials found for the specified criteria.",
      });
    }

    // Return the retrieved study materials
    res.status(200).json({ success: true, data: studyMaterials });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.get("/getSyllabus/:stream/:branch/:branchYear", async (req, res) => {
  try {
    const { stream, branch, branchYear } = req.params; // Extract path parameters

    // Validate parameters
    if (!stream || !branch || !branchYear) {
      return res.status(400).json({
        success: false,
        message: "All parameters (stream, branch, branchYear) are required.",
      });
    }

    let query = { stream, branchYear };

    // Include branch if the stream isn't B.Tech or branchYear isn't First Year
    if (!(stream === "B.Tech" && branchYear === "First Year")) {
      query.branch = branch;
    }

    // Fetch syllabus data from the database based on the query
    const syllabus = await SyllabusModel.find(query);

    // Check if syllabus was found
    if (!syllabus.length) {
      return res.status(404).json({
        success: false,
        message: "No syllabus found for the specified criteria.",
      });
    }

    // Return the retrieved syllabus
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.get("/getPdfs/:stream/:branch/:branchYear", async (req, res) => {
  try {
    const { stream, branch, branchYear } = req.params; // Extract path parameters

    // Check if any parameter is empty
    if (!stream || !branch || !branchYear) {
      return res.status(400).json({
        success: false,
        message: "All parameters (stream, branch, branchYear) are required.",
      });
    }

    let query = { stream, branchYear };

    // If the stream is not B.Tech or branchYear is not First Year, include branch in the query
    if (!(stream === "B.Tech" && branchYear === "First Year")) {
      query.branch = branch;
    }

    // Fetch PDFs from the database based on the query
    const pdfs = await PdfModel.find(query);
 
    // Check if PDFs were found
    if (!pdfs.length) {
      return res.status(404).json({
        success: false,
        message: "No PDFs found for the specified criteria.",
      });
    }

    // Return the retrieved PDFs
    res.status(200).json({ success: true, data: pdfs });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.get("/Cpdf", async (req, res) => {
  try {
    // Fetch all PDFs from the database
    const pdfs = await PdfModel.find({}); // {} ensures fetching all documents

    // Check if PDFs exist
    if (!pdfs || pdfs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No PDFs found.",
      });
    }

    // Send the retrieved PDFs as JSON
    res.status(200).json({ 
      success: true, 
      data: pdfs 
    });

  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.get("/CSyllabus", async (req, res) => {
  try {
    // Fetch all PDFs from the database
    const pdfs = await SyllabusModel.find({}); // {} ensures fetching all documents

    // Check if PDFs exist
    if (!pdfs || pdfs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No PDFs found.",
      });
    }

    // Send the retrieved PDFs as JSON
    res.status(200).json({ 
      success: true, 
      data: pdfs 
    });

  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.get("/CS", async (req, res) => {
  try {
    // Fetch all PDFs from the database
    const pdfs = await StudyMaterialModel.find({}); // {} ensures fetching all documents

    // Check if PDFs exist
    if (!pdfs || pdfs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No PDFs found.",
      });
    }

    // Send the retrieved PDFs as JSON
    res.status(200).json({ 
      success: true, 
      data: pdfs 
    });

  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


app.listen(process.env.PORT || 9000, () => {
  console.log(`Server running on port ${PORT}`);
});
