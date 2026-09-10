import { Router } from "express";
import Course from "../models/Course.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find({ active: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) { next(err); }
});

router.post("/", auth, requireRole("admin"), async (req, res, next) => {
  try { res.status(201).json(await Course.create(req.body)); } catch (err) { next(err); }
});

router.patch("/:id", auth, requireRole("admin"), async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) { next(err); }
});

export default router;