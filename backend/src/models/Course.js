import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tag: { type: String, trim: true },
  description: { type: String, required: true },
  duration: { type: String, trim: true },
  subjects: [{ type: String, trim: true }],
  mode: { type: String, trim: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);