import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  totalMarks: { type: Number, required: true, min: 1 },
  scheduledAt: { type: Date },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Test", testSchema);