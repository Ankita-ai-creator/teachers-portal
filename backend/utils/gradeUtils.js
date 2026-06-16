/**
 * Auto-computes percentage and letter grade based on marks obtained and total marks.
 * A: 90% and above
 * B: 75–89%
 * C: 60–74%
 * D: 45–59%
 * F: below 45%
 */

const calculateGrade = (marksObtained, totalMarks) => {
  if (totalMarks <= 0) return { percentage: 0, letterGrade: 'F' };
  
  const percentage = Math.round((marksObtained / totalMarks) * 100);
  let letterGrade = 'F';

  if (percentage >= 90) letterGrade = 'A';
  else if (percentage >= 75) letterGrade = 'B';
  else if (percentage >= 60) letterGrade = 'C';
  else if (percentage >= 45) letterGrade = 'D';

  return { percentage, letterGrade };
};

module.exports = { calculateGrade };
