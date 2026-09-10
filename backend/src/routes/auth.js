import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

function signUser(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "2h" });
}

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: signUser(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, className: user.className, phone: user.phone }
    });
  } catch (err) { next(err); }
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, className, parentName } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const exists = await User.exists({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "An account with this email already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, phone, className, parentName, role: "student" });
    res.status(201).json({ message: "Student account created", id: user._id });
  } catch (err) { next(err); }
});

export default router;