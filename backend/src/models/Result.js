import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  score: { type: Number, required: true, min: 0 },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  rank: { type: Number, min: 1 }
}, { timestamps: true });

resultSchema.index({ student: 1, test: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);