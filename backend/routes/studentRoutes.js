const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const {
  studentValidationRules,
  attendanceValidationRules,
  validate,
} = require('../middleware/validate');

// ─── GET /api/students ── fetch all with optional search & class ────────────
router.get('/', async (req, res) => {
  try {
    const { search, className, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (className) {
      filter.className = className;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [students, total] = await Promise.all([
      Student.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-attendanceRecords'),
      Student.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('GET /api/students error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/students/:id ── fetch single student ──────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    console.error('GET /api/students/:id error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/students ── create student ────────────────────────────────────
router.post('/', studentValidationRules, validate, async (req, res) => {
  try {
    const { name, rollNumber, className, email, parentContact, gender, dateOfBirth } = req.body;

    const existing = await Student.findOne({
      $or: [{ rollNumber }, { email }],
    });
    if (existing) {
      const field = existing.rollNumber === rollNumber ? 'rollNumber' : 'email';
      return res.status(409).json({
        success: false,
        message: `A student with this ${field === 'rollNumber' ? 'roll number' : 'email'} already exists`,
      });
    }

    const student = await Student.create({
      name,
      rollNumber,
      className,
      email,
      parentContact,
      gender,
      dateOfBirth,
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error('POST /api/students error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/students/:id ── update student ─────────────────────────────────
router.put('/:id', studentValidationRules, validate, async (req, res) => {
  try {
    const { name, rollNumber, className, email, parentContact, gender, dateOfBirth } = req.body;

    const existing = await Student.findOne({
      _id: { $ne: req.params.id },
      $or: [{ rollNumber }, { email }],
    });
    if (existing) {
      const field = existing.rollNumber === rollNumber ? 'rollNumber' : 'email';
      return res.status(409).json({
        success: false,
        message: `A student with this ${field === 'rollNumber' ? 'roll number' : 'email'} already exists`,
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNumber, className, email, parentContact, gender, dateOfBirth },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    console.error('PUT /api/students/:id error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/students/:id ── delete student ──────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    console.error('DELETE /api/students/:id error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/students/attendance ── save bulk attendance ───────────────────
router.post(
  '/attendance',
  attendanceValidationRules,
  validate,
  async (req, res) => {
    try {
      const { attendanceRecords } = req.body;
      
      // We expect an array like: [{ studentId: "...", date: "...", status: "..." }]
      const operations = attendanceRecords.map((record) => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        
        return {
          updateOne: {
            filter: { _id: record.studentId },
            update: {
              $push: {
                attendanceRecords: {
                  date: new Date(record.date),
                  status: record.status,
                }
              }
            }
          }
        };
      });
      
      // Before pushing, it's better to remove existing records for the same date if any, 
      // but to keep it simple and robust, let's process them one by one.
      for (const record of attendanceRecords) {
        const student = await Student.findById(record.studentId);
        if (student) {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          const existingIndex = student.attendanceRecords.findIndex(
            (ar) => ar.date.toISOString().split('T')[0] === recordDate
          );
          
          if (existingIndex >= 0) {
            student.attendanceRecords[existingIndex].status = record.status;
          } else {
            student.attendanceRecords.push({
              date: new Date(record.date),
              status: record.status,
            });
          }
          await student.save();
        }
      }

      res.status(200).json({ success: true, message: 'Attendance saved successfully' });
    } catch (error) {
      console.error('POST /api/students/attendance error:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
