/**
 * Auto-computes percentage and letter grade based on marks obtained and total marks.
 * A: 90% and above
 * B: 75–89%
 * C: 60–74%
 * D: 45–59%
 * F: below 45%
 */

export const calculateGrade = (marksObtained, totalMarks) => {
  if (!totalMarks || totalMarks <= 0) return { percentage: 0, letterGrade: 'F' };
  if (marksObtained === undefined || marksObtained === null || marksObtained === '') return { percentage: null, letterGrade: '-' };

  const parsedMarks = parseFloat(marksObtained);
  const parsedTotal = parseFloat(totalMarks);

  if (isNaN(parsedMarks) || isNaN(parsedTotal)) return { percentage: null, letterGrade: '-' };

  const percentage = Math.round((parsedMarks / parsedTotal) * 100);
  let letterGrade = 'F';

  if (percentage >= 90) letterGrade = 'A';
  else if (percentage >= 75) letterGrade = 'B';
  else if (percentage >= 60) letterGrade = 'C';
  else if (percentage >= 45) letterGrade = 'D';

  return { percentage, letterGrade };
};

export const getGradeColor = (letterGrade) => {
  switch (letterGrade) {
    case 'A': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'B': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'C': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'D': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    case 'F': return 'text-red-400 bg-red-500/10 border-red-500/20';
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
};
