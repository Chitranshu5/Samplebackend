import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true, trim: true },
  examinationYear: {
    type: Number,
    required: true,
  },
  stream: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },
  branchYear: {
    type: String,
    enum: ["First Year", "Second Year", "Third Year", "Fourth Year"],
    required: true,
  },
  semester: { type: Number, required: true, min: 1, max: 8 },
  pdfUrl: {
    type: String,
    required: true,
  },
  downloadUrl: {
    type: String,
    required: true,
  },
  universityName: {
    type: String,
    enum: ["Btu", "Rtu"],
    required: true,
  },
});

export const SyllabusModel = mongoose.model("Syllabus", syllabusSchema);
