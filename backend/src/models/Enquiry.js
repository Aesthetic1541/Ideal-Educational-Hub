import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true, maxlength: 100 },
  parentName: { type: String, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  email: { type: String, trim: true, lowercase: true },
  className: { type: String, trim: true },
  program: { type: String, trim: true },
  message: { type: String, trim: true, maxlength: 1000 },
  status: { type: String, enum: ["new", "contacted", "converted", "closed"], default: "new", index: true }
}, { timestamps: true });

export default mongoose.model("Enquiry", enquirySchema);