const { body, validationResult } = require('express-validator');

const studentValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('rollNumber')
    .trim()
    .notEmpty()
    .withMessage('Roll number is required'),

  body('className')
    .trim()
    .notEmpty()
    .withMessage('Class name is required')
    .isIn([
      '1st', '2nd', '3rd', '4th', '5th', '6th',
      '7th', '8th', '9th', '10th', '11th', '12th',
    ])
    .withMessage('Invalid class name'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('parentContact')
    .trim()
    .notEmpty()
    .withMessage('Parent contact is required')
    .matches(/^\d{10}$/)
    .withMessage('Parent contact must be a 10-digit number'),

  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Invalid gender'),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Must be a valid date'),
];

const attendanceValidationRules = [
  body('attendanceRecords')
    .isArray({ min: 1 })
    .withMessage('Attendance records must be a non-empty array'),

  body('attendanceRecords.*.studentId')
    .notEmpty()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Invalid student ID format'),

  body('attendanceRecords.*.date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('attendanceRecords.*.status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['present', 'absent'])
    .withMessage('Status must be either present or absent'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  studentValidationRules,
  attendanceValidationRules,
  validate,
};
