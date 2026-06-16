const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const upload = require('../middleware/upload');

// ─── GET /api/assignments ── list all (optional filter by class and subject)
router.get('/', async (req, res) => {
  try {
    const { className, subject } = req.query;
    const filter = {};
    if (className) {
      filter.className = className;
    }
    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' };
    }

    const assignments = await Assignment.find(filter)
      .sort({ dueDate: 1 })
      .populate('submittedBy', 'name rollNumber');

    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    console.error('GET /api/assignments error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/assignments/:id ── single assignment ──────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('submittedBy', 'name rollNumber');
      
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/assignments ── create assignment (with file upload) ──────────
router.post('/', (req, res, next) => {
  upload.single('attachment')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, description, className, subject, dueDate } = req.body;
    let attachmentUrl = null;

    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const assignment = await Assignment.create({
      title,
      description,
      className,
      subject,
      dueDate,
      attachmentUrl,
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error('POST /api/assignments error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/assignments/:id ── update assignment ──────────────────────────
router.put('/:id', (req, res, next) => {
  upload.single('attachment')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, description, className, subject, dueDate } = req.body;
    
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    let attachmentUrl = assignment.attachmentUrl;
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.className = className || assignment.className;
    assignment.subject = subject || assignment.subject;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.attachmentUrl = attachmentUrl;

    await assignment.save();

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    console.error('PUT /api/assignments/:id error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/assignments/:id ── delete assignment ───────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(200).json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/assignments/:id/submit ── mark assignment as submitted ───────
router.post('/:id/submit', async (req, res) => {
  try {
    const { studentId } = req.body;
    
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check if already submitted
    if (assignment.submittedBy.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'Student has already submitted this assignment' });
    }

    assignment.submittedBy.push(studentId);
    await assignment.save();

    res.status(200).json({ success: true, message: 'Submission recorded', data: assignment });
  } catch (error) {
    console.error('POST /api/assignments/:id/submit error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
