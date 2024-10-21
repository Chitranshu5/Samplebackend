import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  examinationYear: { type: Number, required: true },
  stream: { type: String, required: true },
  branch: { type: String, required: true },
  branchYear: {
    type: String,
    enum: ["First Year", "Second Year", "Third Year", "Fourth Year"],
    required: true,
  },
  semester:{type:Number,required:true,min:1,max:8},
  url: { type: String, required: true },
  downloadUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  universityName: { type: String, enum: ["Btu", "Rtu"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const PdfModel = mongoose.model("Pdf", pdfSchema);
