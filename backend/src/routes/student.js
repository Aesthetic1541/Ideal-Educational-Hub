import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import User from "../models/User.js";
import Result from "../models/Result.js";
import Test from "../models/Test.js";
import Attendance from "../models/Attendance.js";
import Announcement from "../models/Announcement.js";
import Course from "../models/Course.js";

const router = Router();
router.use(auth, requireRole("student"));

router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("course");
    if (!user) return res.status(404).json({ message: "Student not found" });
    res.json(user);
  } catch (err) { next(err); }
});

router.get("/dashboard", async (req, res, next) => {
  try {
    const [user, results, attendance, tests, announcements] = await Promise.all([
      User.findById(req.user.id).select("-password").populate("course"),
      Result.find({ student: req.user.id }).populate("test").sort({ createdAt: -1 }).limit(10),
      Attendance.find({ student: req.user.id }).sort({ date: -1 }).limit(100),
      Test.find({ active: true }).sort({ scheduledAt: 1 }).limit(10),
      Announcement.find({ audience: { $in: ["all", "students"] } }).sort({ publishedAt: -1 }).limit(10)
    ]);

    const attendancePct = attendance.length
      ? Math.round(attendance.filter(a => a.status === "present").length / attendance.length * 100)
      : 0;
    const overall = results.length
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    res.json({
      user,
      stats: { overallScore: overall, attendance: attendancePct, testsCompleted: results.length },
      recentResults: results,
      upcomingTests: tests,
      announcements
    });
  } catch (err) { next(err); }
});

router.get("/tests", async (req, res, next) => {
  try { res.json(await Test.find({ active: true }).sort({ scheduledAt: 1 })); } catch (err) { next(err); }
});

router.get("/results", async (req, res, next) => {
  try { res.json(await Result.find({ student: req.user.id }).populate("test").sort({ createdAt: -1 })); } catch (err) { next(err); }
});

router.get("/attendance", async (req, res, next) => {
  try { res.json(await Attendance.find({ student: req.user.id }).sort({ date: -1 })); } catch (err) { next(err); }
});

export default router;