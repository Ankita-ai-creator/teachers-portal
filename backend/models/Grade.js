const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0,
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1,
  },
  percentage: {
    type: Number,
    required: true,
  },
  letterGrade: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'F'],
  },
  teacherFeedback: {
    type: String,
    trim: true,
  },
  gradedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a student only has one grade per assignment
gradeSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('Grade', gradeSchema);
