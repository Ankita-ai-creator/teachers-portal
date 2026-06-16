import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getStudentById } from '../api/students';
import { getGradesByStudent } from '../api/grades';
import { getGradeColor } from '../utils/gradeUtils';

const ReportCard = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, gradesRes] = await Promise.all([
          getStudentById(id),
          getGradesByStudent(id)
        ]);
        setStudent(studentRes.data);
        setGrades(gradesRes.data);
      } catch (err) {
        toast.error('Failed to load report card data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading Report Card...</div>;
  if (!student) return <div className="text-center py-12 text-slate-400">Student not found.</div>;

  // Calculate overall average
  const totalPercentage = grades.reduce((acc, curr) => acc + curr.percentage, 0);
  const overallAverage = grades.length > 0 ? Math.round(totalPercentage / grades.length) : 0;

  return (
    <div className="max-w-4xl mx-auto mb-12">
      {/* Non-printable header controls */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link to="/" className="text-accent-primary hover:text-accent-secondary inline-flex items-center gap-2 transition-colors">
          <FiArrowLeft /> Back to Students
        </Link>
        <button onClick={handlePrint} className="btn btn-secondary">
          <FiPrinter /> Print Report
        </button>
      </div>

      {/* Printable Report Card Area */}
      <div className="card bg-white text-slate-900 print:shadow-none print:border-none print:p-0">
        
        {/* School / Report Header */}
        <div className="text-center border-b-2 border-slate-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-widest mb-2">Teachers Portal Academy</h1>
          <h2 className="text-xl font-semibold text-slate-600">Official Student Report Card</h2>
          <p className="text-sm text-slate-500 mt-2">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase">Student Name</p>
            <p className="text-lg font-bold text-slate-800">{student.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase">Class & Roll No</p>
            <p className="text-lg font-bold text-slate-800">Class {student.className} • Roll {student.rollNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase">Date of Birth</p>
            <p className="text-md font-semibold text-slate-700">{student.dateOfBirth ? format(new Date(student.dateOfBirth), 'MMM d, yyyy') : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium uppercase">Parent Contact</p>
            <p className="text-md font-semibold text-slate-700">{student.parentContact}</p>
          </div>
        </div>

        {/* Grades Table */}
        <div className="mb-8 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider">Subject</th>
                <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider">Assignment</th>
                <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider text-center">Marks</th>
                <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider text-center">Percentage</th>
                <th className="py-3 px-4 font-bold uppercase text-xs tracking-wider text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {grades.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No grades recorded yet.</td>
                </tr>
              ) : (
                grades.map(grade => {
                  const gradeColor = getGradeColor(grade.letterGrade);
                  return (
                    <tr key={grade._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-800">{grade.subject}</td>
                      <td className="py-4 px-4 text-slate-600">{grade.assignmentId?.title || 'Unknown'}</td>
                      <td className="py-4 px-4 text-center text-slate-700 font-medium">
                        {grade.marksObtained} / {grade.totalMarks}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-700">{grade.percentage}%</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold border bg-white ${gradeColor.replace('text-', 'text-').replace('bg-', '').replace('border-', 'border-')}`}>
                          {grade.letterGrade}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Overall Summary */}
        {grades.length > 0 && (
          <div className="bg-slate-800 text-white p-6 rounded-lg flex justify-between items-center print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
            <div>
              <h3 className="text-lg font-medium text-slate-300 print:text-slate-600 uppercase tracking-wider">Overall Performance</h3>
              <p className="text-3xl font-bold mt-1">{overallAverage}%</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-medium text-slate-300 print:text-slate-600 uppercase tracking-wider">Final Grade</h3>
              <p className="text-4xl font-black text-accent-secondary print:text-slate-800">
                {overallAverage >= 90 ? 'A' : overallAverage >= 75 ? 'B' : overallAverage >= 60 ? 'C' : overallAverage >= 45 ? 'D' : 'F'}
              </p>
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body { background: white; color: black; }
            .print\\:hidden { display: none !important; }
            .container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
            nav, .Toastify { display: none !important; }
          }
        `}} />
      </div>
    </div>
  );
};

export default ReportCard;
