import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./model/db.js";
import { PdfModel } from "./model/pdf.model.js";
import { Post } from "./model/post.model.js";
import { responseHelper } from "./util/helper.js";
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



app.listen(process.env.PORT || 9000, () => {
  console.log(`Server running on port ${PORT}`);
});
