const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// 🔐 Secret key (use env in production)
const JWT_SECRET = "your_secret_key";

// ✅ POST /api/users/register — Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, studentEmail } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (include role)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            ...(role === 'parent' && studentEmail ? { studentEmail } : {})
        });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ POST /api/users/login — User login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user existence
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users?role=student|parent|therapist — List users by role
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users — Add a new user (admin)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, studentEmail } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'parent' && studentEmail ? { studentEmail } : {})
    });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id — Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/students — Get all users with role: 'student'
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }, '-password'); // Exclude password
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/linked-student/:parentId — Get the student linked to a parent
router.get('/linked-student/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;
    const parent = await User.findById(parentId);
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    if (!parent.studentEmail) return res.status(404).json({ message: "No student linked to this parent" });

    const student = await User.findOne({ email: parent.studentEmail, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
