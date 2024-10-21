import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("UserData", pdfSchema);
