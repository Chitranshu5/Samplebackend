import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema({
    materialTitle: { type: String, required: true, trim: true },
    stream: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    branchYear: {
        type: String,
        enum: ["First Year", "Second Year", "Third Year", "Fourth Year"],
        required: true,
    },
    semester: { type: Number, required: true, min: 1, max: 8 },
    yearWise: { type: Number, required: true,},
    subject: { type: String, required: true, trim: true },
    pdfUrl: { type: String, required: true },
    downloadUrl: { type: String, required: true },
    universityName: {
        type: String,
        enum: ["Btu", "Rtu"],
        required: true,
    },
    uploadedDate: { type: Date, default: Date.now }, // Track upload date
});

export const StudyMaterialModel = mongoose.model(
    "StudyMaterial",
    studyMaterialSchema
);
