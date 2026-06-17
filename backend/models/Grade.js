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

  // ✅ FIX: percentage and letterGrade are no longer required from the caller.
  //    They are auto-computed in the pre('save') hook below so they can
  //    never be inconsistent with marksObtained / totalMarks.
  percentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  letterGrade: {
    type: String,
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

// ✅ FIX: Auto-compute percentage and letterGrade before every save.
//    This also runs on findOneAndUpdate if you pass { runValidators: true, context: 'query' }
//    but the safest place to enforce it is here on the document hook.
gradeSchema.pre('save', function (next) {
  // Compute percentage rounded to 2 decimal places
  this.percentage = parseFloat(((this.marksObtained / this.totalMarks) * 100).toFixed(2));

  // Derive letterGrade from percentage
  if (this.percentage >= 90) this.letterGrade = 'A';
  else if (this.percentage >= 75) this.letterGrade = 'B';
  else if (this.percentage >= 60) this.letterGrade = 'C';
  else if (this.percentage >= 45) this.letterGrade = 'D';
  else this.letterGrade = 'F';

  next();
});

// ✅ Also handle findOneAndUpdate (used by gradeRoutes when updating a grade)
gradeSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  const marksObtained = update.marksObtained ?? update.$set?.marksObtained;
  const totalMarks = update.totalMarks ?? update.$set?.totalMarks;

  if (marksObtained !== undefined && totalMarks !== undefined) {
    const percentage = parseFloat(((marksObtained / totalMarks) * 100).toFixed(2));

    let letterGrade;
    if (percentage >= 90) letterGrade = 'A';
    else if (percentage >= 75) letterGrade = 'B';
    else if (percentage >= 60) letterGrade = 'C';
    else if (percentage >= 45) letterGrade = 'D';
    else letterGrade = 'F';

    this.set({ percentage, letterGrade });
  }

  next();
});

// Ensure a student only has one grade per assignment
gradeSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('Grade', gradeSchema);