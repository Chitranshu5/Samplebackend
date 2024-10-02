import express from "express";
import { configDotenv } from "dotenv";
import cors from 'cors'
import { connectToDatabase } from "./model/db.js";
import { PdfModel } from "./model/pdf.model.js";
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
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
});

app.listen(process.env.PORT || 9000, () => {
  console.log(`Server running on port ${PORT}`);
});
