import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
const Note = mongoose.model("Note", noteSchema);
export default Note;