import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["student", "admin"], default: "student", index: true },
  phone: { type: String, trim: true },
  className: { type: String, trim: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  parentName: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);