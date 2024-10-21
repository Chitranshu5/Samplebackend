import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },           // Title of the paper
  examinationYear: { type: Number, required: true }, // Year of the examination
  stream: { type: String, required: true },          // Stream (e.g., B.Tech, M.Tech)
  branch: { type: String, required: true },          // Branch (e.g., Computer Science, Mechanical)
  branchYear: {                                       // Year within the branch (e.g., First Year)
    type: String,
    enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'], 
    required: true
  },
  url: { type: String, required: true },             // Public URL of the PDF
  downloadUrl: { type: String, required: true },     // Download URL of the PDF
  fileName: { type: String, required: true },        // File name of the uploaded PDF
  createdAt: { type: Date, default: Date.now },      // Timestamp when the record is created
});

export const PdfModel = mongoose.model('Pdf', pdfSchema);
