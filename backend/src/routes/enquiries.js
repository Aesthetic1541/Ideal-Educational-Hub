import { Router } from "express";
import Enquiry from "../models/Enquiry.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { studentName, phone } = req.body;
    if (!studentName || !phone) return res.status(400).json({ message: "Student name and phone are required" });
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ message: "Enquiry submitted successfully", enquiryId: enquiry._id });
  } catch (err) { next(err); }
});

router.get("/", auth, requireRole("admin"), async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(200);
    res.json(enquiries);
  } catch (err) { next(err); }
});

router.patch("/:id", auth, requireRole("admin"), async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) { next(err); }
});

export default router;