import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Test from "../models/Test.js";
import Announcement from "../models/Announcement.js";

async function seed() {
  await connectDB();

  // Create/update courses without creating duplicates
  const courseData = [
    {
      name: "Foundation Program",
      tag: "Classes 8–10",
      description: "Concept-focused foundation learning.",
      duration: "Academic year",
      subjects: ["Mathematics", "Science"],
      mode: "Offline / Centre",
      active: true
    },
    {
      name: "Board Excellence",
      tag: "Classes 10–12",
      description: "Structured support for school and board preparation.",
      duration: "Academic year",
      subjects: ["Mathematics", "Science", "English"],
      mode: "Offline / Centre",
      active: true
    },
    {
      name: "Competitive Preparation",
      tag: "JEE / NEET",
      description: "Concept-first competitive preparation.",
      duration: "As per batch",
      subjects: ["Physics", "Chemistry", "Mathematics / Biology"],
      mode: "Offline / Centre",
      active: true
    }
  ];

  const courses = [];

  for (const data of courseData) {
    const course = await Course.findOneAndUpdate(
      { name: data.name },
      { $set: data },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    courses.push(course);
  }

  console.log(`Courses ready: ${courses.length}`);

  // Create/update demo student
  const studentPassword = await bcrypt.hash("Student123!", 12);

  await User.updateOne(
    { email: "student@idealhub.local" },
    {
      $set: {
        name: "Demo Student",
        email: "student@idealhub.local",
        password: studentPassword,
        role: "student",
        className: "12",
        course: courses[1]._id
      }
    },
    { upsert: true }
  );

  // Create/update admin
  const adminEmail = (
    process.env.ADMIN_EMAIL || "admin@idealhub.local"
  ).toLowerCase();

  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "ChangeMe123!",
    12
  );

  await User.updateOne(
    { email: adminEmail },
    {
      $set: {
        name: "Institute Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin"
      }
    },
    { upsert: true }
  );

  // Create demo tests only if none exist
  if (await Test.countDocuments() === 0) {
    await Test.insertMany([
      {
        title: "Physics Practice Test",
        subject: "Physics",
        durationMinutes: 60,
        totalMarks: 100,
        scheduledAt: new Date(Date.now() + 86400000),
        active: true
      },
      {
        title: "Mathematics Assessment",
        subject: "Mathematics",
        durationMinutes: 60,
        totalMarks: 100,
        scheduledAt: new Date(Date.now() + 3 * 86400000),
        active: true
      }
    ]);
  }

  // Create demo announcement only if none exists
  if (await Announcement.countDocuments() === 0) {
    await Announcement.create({
      title: "Welcome to the student portal",
      message:
        "This is a demo announcement. Replace it with official institute notices.",
      audience: "students"
    });
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});