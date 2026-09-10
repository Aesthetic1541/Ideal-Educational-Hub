import { Router } from "express";
import bcrypt from "bcryptjs";
import { auth, requireRole } from "../middleware/auth.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Test from "../models/Test.js";
import Result from "../models/Result.js";
import Attendance from "../models/Attendance.js";
import Announcement from "../models/Announcement.js";
import Enquiry from "../models/Enquiry.js";

const router = Router();
router.use(auth, requireRole("admin"));

router.get("/dashboard", async (req, res, next) => {
  try {
    const [students, courses, tests, enquiries] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({ active: true }),
      Test.countDocuments({ active: true }),
      Enquiry.countDocuments({ status: "new" })
    ]);
    res.json({ students, courses, tests, newEnquiries: enquiries });
  } catch (err) { next(err); }
});

router.get("/students", async (req, res, next) => {
  try { res.json(await User.find({ role: "student" }).select("-password").populate("course").sort({ createdAt: -1 })); } catch (err) { next(err); }
});

router.post("/tests", async (req, res, next) => {
  try { res.status(201).json(await Test.create(req.body)); } catch (err) { next(err); }
});

router.post("/results", async (req, res, next) => {
  try {
    const { student, test, score, rank } = req.body;
    const testDoc = await Test.findById(test);
    if (!testDoc) return res.status(404).json({ message: "Test not found" });
    if (score < 0 || score > testDoc.totalMarks) return res.status(400).json({ message: "Score is outside test marks" });
    const percentage = Number(((score / testDoc.totalMarks) * 100).toFixed(2));
    const result = await Result.findOneAndUpdate(
      { student, test },
      { student, test, score, percentage, rank },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.post("/attendance", async (req, res, next) => {
  try {
    const { student, date, status } = req.body;
    const record = await Attendance.findOneAndUpdate(
      { student, date: new Date(date) },
      { student, date: new Date(date), status },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(record);
  } catch (err) { next(err); }
});

router.post("/announcements", async (req, res, next) => {
  try { res.status(201).json(await Announcement.create(req.body)); } catch (err) { next(err); }
});

router.get("/enquiries", async (req, res, next) => {
  try { res.json(await Enquiry.find().sort({ createdAt: -1 }).limit(500)); } catch (err) { next(err); }
});

export default router;