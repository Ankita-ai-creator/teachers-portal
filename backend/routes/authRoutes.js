const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');

// ─── POST /api/auth/register ── Register a new teacher
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, subject } = req.body;

    const teacherExists = await Teacher.findOne({ email });

    if (teacherExists) {
      return res.status(400).json({ success: false, message: 'Teacher already exists' });
    }

    const teacher = await Teacher.create({
      name,
      email,
      password,
      subject,
    });

    if (teacher) {
      res.status(201).json({
        success: true,
        data: {
          _id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
          token: generateToken(teacher._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid teacher data' });
    }
  } catch (error) {
    console.error('POST /api/auth/register error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/auth/login ── Authenticate teacher & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email }).select('+password');

    if (teacher && (await teacher.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
          token: generateToken(teacher._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('POST /api/auth/login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/auth/me ── Get current logged in teacher
router.get('/me', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id);
    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error('GET /api/auth/me error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
