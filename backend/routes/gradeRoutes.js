const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const Student = require('../models/Student');
const { calculateGrade } = require('../utils/gradeUtils');
const mongoose = require('mongoose');

// ─── POST /api/grades ── submit a single grade
router.post('/', async (req, res) => {
  try {
    const { studentId, assignmentId, subject, marksObtained, totalMarks, teacherFeedback } = req.body;
    
    const { percentage, letterGrade } = calculateGrade(marksObtained, totalMarks);

    const grade = await Grade.create({
      studentId,
      assignmentId,
      subject,
      marksObtained,
      totalMarks,
      percentage,
      letterGrade,
      teacherFeedback,
    });

    res.status(201).json({ success: true, data: grade });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Grade already exists for this assignment' });
    }
    console.error('POST /api/grades error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/grades/bulk ── submit grades for multiple students
router.post('/bulk', async (req, res) => {
  try {
    const { grades } = req.body; // Array of grade objects

    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid bulk grades payload' });
    }

    const bulkOps = grades.map(g => {
      const { percentage, letterGrade } = calculateGrade(g.marksObtained, g.totalMarks);
      
      return {
        updateOne: {
          filter: { studentId: g.studentId, assignmentId: g.assignmentId },
          update: {
            $set: {
              subject: g.subject,
              marksObtained: g.marksObtained,
              totalMarks: g.totalMarks,
              percentage,
              letterGrade,
              teacherFeedback: g.teacherFeedback || '',
              gradedAt: new Date(),
            }
          },
          upsert: true
        }
      };
    });

    const result = await Grade.bulkWrite(bulkOps);
    res.status(200).json({ success: true, message: 'Bulk grades saved', data: result });
  } catch (error) {
    console.error('POST /api/grades/bulk error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/grades/:id ── update grade
router.put('/:id', async (req, res) => {
  try {
    const { marksObtained, totalMarks, teacherFeedback } = req.body;
    
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ success: false, message: 'Grade not found' });
    }

    const { percentage, letterGrade } = calculateGrade(
      marksObtained !== undefined ? marksObtained : grade.marksObtained, 
      totalMarks !== undefined ? totalMarks : grade.totalMarks
    );

    grade.marksObtained = marksObtained !== undefined ? marksObtained : grade.marksObtained;
    grade.totalMarks = totalMarks !== undefined ? totalMarks : grade.totalMarks;
    grade.percentage = percentage;
    grade.letterGrade = letterGrade;
    if (teacherFeedback !== undefined) grade.teacherFeedback = teacherFeedback;
    grade.gradedAt = new Date();

    await grade.save();
    res.status(200).json({ success: true, data: grade });
  } catch (error) {
    console.error('PUT /api/grades/:id error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/grades/student/:studentId ── all grades for one student
router.get('/student/:studentId', async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId })
      .populate('assignmentId', 'title subject className')
      .sort({ gradedAt: -1 });
      
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/grades/assignment/:assignmentId ── all grades for one assignment
router.get('/assignment/:assignmentId', async (req, res) => {
  try {
    const grades = await Grade.find({ assignmentId: req.params.assignmentId })
      .populate('studentId', 'name rollNumber');
      
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/grades/analytics/:className ── average score per subject & top 5 students
router.get('/analytics/:className', async (req, res) => {
  try {
    const { className } = req.params;

    // We need to find students in this class first to filter grades
    const students = await Student.find({ className }).select('_id name rollNumber');
    const studentIds = students.map(s => s._id);

    if (studentIds.length === 0) {
      return res.status(200).json({ success: true, data: { subjectAverages: [], topStudents: [] } });
    }

    // Aggregation 1: Average score per subject
    const subjectAverages = await Grade.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { 
        $group: { 
          _id: '$subject', 
          avgPercentage: { $avg: '$percentage' } 
        } 
      },
      { $project: { subject: '$_id', avgPercentage: { $round: ['$avgPercentage', 2] }, _id: 0 } },
      { $sort: { subject: 1 } }
    ]);

    // Aggregation 2: Top 5 students by overall percentage
    const topStudentsData = await Grade.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { 
        $group: { 
          _id: '$studentId', 
          overallPercentage: { $avg: '$percentage' } 
        } 
      },
      { $sort: { overallPercentage: -1 } },
      { $limit: 5 }
    ]);

    // Populate student details manually since we only have IDs from aggregation
    const topStudents = topStudentsData.map(ts => {
      const studentInfo = students.find(s => s._id.equals(ts._id));
      return {
        studentId: ts._id,
        name: studentInfo ? studentInfo.name : 'Unknown',
        rollNumber: studentInfo ? studentInfo.rollNumber : 'N/A',
        overallPercentage: Math.round(ts.overallPercentage * 100) / 100,
      };
    });

    res.status(200).json({ 
      success: true, 
      data: { subjectAverages, topStudents } 
    });
  } catch (error) {
    console.error('GET /api/grades/analytics error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
