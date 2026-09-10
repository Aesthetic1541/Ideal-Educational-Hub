import { Router } from "express";

import { auth, requireRole } from "../middleware/auth.js";

import User from "../models/User.js";
import Course from "../models/Course.js";
import Test from "../models/Test.js";
import Result from "../models/Result.js";
import Attendance from "../models/Attendance.js";
import Announcement from "../models/Announcement.js";
import Enquiry from "../models/Enquiry.js";
import bcrypt from "bcryptjs";

const router = Router();

router.use(auth, requireRole("admin"));


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/dashboard", async (req, res, next) => {
  try {
    const [students, courses, tests, enquiries] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({ active: true }),
      Test.countDocuments({ active: true }),
      Enquiry.countDocuments({ status: "new" }),
    ]);

    res.json({
      students,
      courses,
      tests,
      newEnquiries: enquiries,
    });
  } catch (err) {
    next(err);
  }
});


// =====================================================
// STUDENTS
// =====================================================

router.get("/students", async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    next(err);
  }
});


// Create student
router.post("/students", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      className,
      course,
      parentName,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const student = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
      phone,
      className,
      course: course || undefined,
      parentName,
    });

    const result = student.toObject();
    delete result.password;

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});


// Update student
router.put("/students/:id", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      className,
      course,
      parentName,
    } = req.body;

    const student = await User.findOne({
      _id: req.params.id,
      role: "student",
    }).select("+password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email.toLowerCase();
    if (phone !== undefined) student.phone = phone;
    if (className !== undefined) student.className = className;
    if (parentName !== undefined) student.parentName = parentName;

    if (course !== undefined) {
      student.course = course || undefined;
    }

    if (password) {
      student.password = await bcrypt.hash(password, 12);
    }

    await student.save();

    const result = student.toObject();
    delete result.password;

    res.json(result);
  } catch (err) {
    next(err);
  }
});


// Delete student
router.delete("/students/:id", async (req, res, next) => {
  try {
    const student = await User.findOneAndDelete({
      _id: req.params.id,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});


// =====================================================
// COURSES
// =====================================================

// Get all courses
router.get("/courses", async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    next(err);
  }
});


// Create course
router.post("/courses", async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
});


// Update course
router.put("/courses/:id", async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (err) {
    next(err);
  }
});


// Delete course
router.delete("/courses/:id", async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      message: "Course deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});


// =====================================================
// TESTS
// =====================================================

// Get tests
router.get("/tests", async (req, res, next) => {
  try {
    const tests = await Test.find()
      .sort({ scheduledAt: -1, createdAt: -1 });

    res.json(tests);
  } catch (err) {
    next(err);
  }
});


// Create test
router.post("/tests", async (req, res, next) => {
  try {
    const test = await Test.create(req.body);

    res.status(201).json(test);
  } catch (err) {
    next(err);
  }
});


// =====================================================
// RESULTS
// =====================================================

router.post("/results", async (req, res, next) => {
  try {
    const {
      student,
      test,
      score,
      rank,
    } = req.body;

    const testDoc = await Test.findById(test);

    if (!testDoc) {
      return res.status(404).json({
        message: "Test not found",
      });
    }

    if (
      score < 0 ||
      score > testDoc.totalMarks
    ) {
      return res.status(400).json({
        message: "Score is outside test marks",
      });
    }

    const percentage = Number(
      ((score / testDoc.totalMarks) * 100).toFixed(2)
    );

    const result = await Result.findOneAndUpdate(
      {
        student,
        test,
      },
      {
        student,
        test,
        score,
        percentage,
        rank,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});


// =====================================================
// ATTENDANCE
// =====================================================

router.post("/attendance", async (req, res, next) => {
  try {
    const {
      student,
      date,
      status,
    } = req.body;

    const record = await Attendance.findOneAndUpdate(
      {
        student,
        date: new Date(date),
      },
      {
        student,
        date: new Date(date),
        status,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});


// =====================================================
// ANNOUNCEMENTS
// =====================================================

router.post("/announcements", async (req, res, next) => {
  try {
    const announcement = await Announcement.create(
      req.body
    );

    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
});


// =====================================================
// ENQUIRIES
// =====================================================

// Get enquiries
router.get("/enquiries", async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(500);

    res.json(enquiries);
  } catch (err) {
    next(err);
  }
});


// Update enquiry status
router.patch("/enquiries/:id", async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "new",
      "contacted",
      "closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid enquiry status",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    res.json(enquiry);
  } catch (err) {
    next(err);
  }
});


export default router;