const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  className: {
    type: String,
    required: [true, 'Class name is required'],
    enum: [
      '1st', '2nd', '3rd', '4th', '5th', '6th',
      '7th', '8th', '9th', '10th', '11th', '12th',
    ],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  attachmentUrl: {
    type: String,
    default: null,
  },
  submittedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Assignment', assignmentSchema);