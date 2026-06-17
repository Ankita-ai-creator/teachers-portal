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
    if (error.name === 'CastError') {
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
    if (error.name === 'CastError') {
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
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    console.error('DELETE /api/students/:id error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/students/attendance ── save bulk attendance ───────────────────
// ⚠️  NOTE: This route MUST be registered before any /:id routes in the file
//     to prevent Express from treating "attendance" as an :id param.
//     Move this route above GET /:id if you reorganise the file.
router.post(
  '/attendance',
  attendanceValidationRules,
  validate,
  async (req, res) => {
    try {
      const { attendanceRecords } = req.body;
      // We expect an array like: [{ studentId: "...", date: "...", status: "..." }]

      // ✅ FIX: Fetch all students once, update in memory, then bulkWrite in ONE DB call.
      //    Old code built `operations` but never used it — instead running N individual
      //    findById + save calls (one per student). Replaced with true bulkWrite.

      // Step 1: For each record, we need to either update an existing date entry
      //         or push a new one. MongoDB doesn't support conditional $push vs $set
      //         in a single atomic op without knowing if the subdoc exists, so we
      //         use arrayFilters with $set for existing dates and a separate $push
      //         pass for new ones. Simplest safe approach: two-stage bulkWrite.

      const dateMap = {}; // studentId -> { date string -> status }
      for (const record of attendanceRecords) {
        const dateStr = new Date(record.date).toISOString().split('T')[0];
        if (!dateMap[record.studentId]) dateMap[record.studentId] = {};
        dateMap[record.studentId][dateStr] = record.status;
      }

      // Fetch only the affected students
      const studentIds = Object.keys(dateMap);
      const students = await Student.find({ _id: { $in: studentIds } }).select('attendanceRecords');

      const bulkOps = students.map((student) => {
        const updates = dateMap[student._id.toString()];
        const existingDates = new Set(
          student.attendanceRecords.map((ar) => ar.date.toISOString().split('T')[0])
        );

        // Separate into records to update vs records to add
        const toUpdate = [];
        const toAdd = [];

        for (const [dateStr, status] of Object.entries(updates)) {
          if (existingDates.has(dateStr)) {
            toUpdate.push({ dateStr, status });
          } else {
            toAdd.push({ date: new Date(dateStr), status });
          }
        }

        // Build the update payload
        const updatePayload = {};

        if (toAdd.length > 0) {
          updatePayload.$push = {
            attendanceRecords: { $each: toAdd },
          };
        }

        if (toUpdate.length > 0) {
          // Use arrayFilters to update existing entries by date
          return {
            updateOne: {
              filter: { _id: student._id },
              update: {
                ...updatePayload,
                $set: toUpdate.reduce((acc, { dateStr, status }) => {
                  acc[`attendanceRecords.$[elem${dateStr.replace(/-/g, '')}].status`] = status;
                  return acc;
                }, {}),
              },
              arrayFilters: toUpdate.map(({ dateStr }) => ({
                [`elem${dateStr.replace(/-/g, '')}.date`]: new Date(dateStr),
              })),
            },
          };
        }

        // No updates needed — only additions
        if (Object.keys(updatePayload).length === 0) return null;

        return {
          updateOne: {
            filter: { _id: student._id },
            update: updatePayload,
          },
        };
      }).filter(Boolean);

      if (bulkOps.length > 0) {
        await Student.bulkWrite(bulkOps); // ✅ Single DB round-trip
      }

      res.status(200).json({ success: true, message: 'Attendance saved successfully' });
    } catch (error) {
      console.error('POST /api/students/attendance error:', error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;