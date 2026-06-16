const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['present', 'absent'],
        message: 'Status must be either present or absent',
      },
      required: [true, 'Status is required'],
    },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
  },
  className: {
    type: String,
    required: [true, 'Class name is required'],
    enum: {
      values: [
        '1st', '2nd', '3rd', '4th', '5th', '6th',
        '7th', '8th', '9th', '10th', '11th', '12th',
      ],
      message: 'Invalid class name',
    },
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address',
    ],
  },
  parentContact: {
    type: String,
    required: [true, 'Parent contact is required'],
    match: [/^\d{10}$/, 'Parent contact must be a 10-digit number'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  attendanceRecords: {
    type: [attendanceSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search performance
studentSchema.index({ name: 'text', rollNumber: 'text' });

module.exports = mongoose.model('Student', studentSchema);
