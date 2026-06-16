import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getStudents } from '../api/students';
import { getAssignments } from '../api/assignments';
import { submitBulkGrades, getGradesByAssignment } from '../api/grades';
import { calculateGrade, getGradeColor } from '../utils/gradeUtils';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const GradeEntry = () => {
  const [className, setClassName] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [students, setStudents] = useState([]);
  const [globalTotalMarks, setGlobalTotalMarks] = useState(100);
  
  // grades state shape: { studentId: { marksObtained: '', feedback: '' } }
  const [gradesData, setGradesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch assignments when class changes
  useEffect(() => {
    if (className) {
      getAssignments({ className }).then(res => {
        setAssignments(res.data);
        setSelectedAssignment('');
        setStudents([]);
        setGradesData({});
      }).catch(err => toast.error('Failed to load assignments'));
    }
  }, [className]);

  // Fetch students and existing grades when assignment selected
  useEffect(() => {
    if (className && selectedAssignment) {
      fetchData();
    }
  }, [selectedAssignment]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, gradesRes] = await Promise.all([
        getStudents({ className, limit: 100 }),
        getGradesByAssignment(selectedAssignment)
      ]);

      setStudents(studentsRes.data);
      
      const initialGrades = {};
      const existingGrades = gradesRes.data;

      // Map existing grades if any
      studentsRes.data.forEach(student => {
        const existing = existingGrades.find(g => g.studentId._id === student._id);
        if (existing) {
          initialGrades[student._id] = {
            marksObtained: existing.marksObtained,
            feedback: existing.teacherFeedback || ''
          };
          if (existing.totalMarks) setGlobalTotalMarks(existing.totalMarks);
        } else {
          initialGrades[student._id] = { marksObtained: '', feedback: '' };
        }
      });
      setGradesData(initialGrades);

    } catch (err) {
      toast.error('Failed to load roster data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (studentId, field, value) => {
    setGradesData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const assignmentObj = assignments.find(a => a._id === selectedAssignment);

      const bulkPayload = students
        .filter(student => gradesData[student._id]?.marksObtained !== '')
        .map(student => ({
          studentId: student._id,
          assignmentId: selectedAssignment,
          subject: assignmentObj.subject,
          marksObtained: Number(gradesData[student._id].marksObtained),
          totalMarks: Number(globalTotalMarks),
          teacherFeedback: gradesData[student._id].feedback
        }));

      if (bulkPayload.length === 0) {
        toast.info('No grades entered yet.');
        setSaving(false);
        return;
      }

      await submitBulkGrades(bulkPayload);
      toast.success('Grades saved successfully!');
      fetchData(); // refresh to show updated data
    } catch (err) {
      toast.error('Failed to save bulk grades');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Grade Entry</h1>
        <p className="text-slate-400 mt-1">Bulk enter grades for assignments</p>
      </div>

      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-400 mb-2">Class</label>
            <select 
              className="form-control" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)}
            >
              <option value="">Select Class</option>
              {CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
            </select>
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-400 mb-2">Assignment</label>
            <select 
              className="form-control" 
              value={selectedAssignment} 
              onChange={(e) => setSelectedAssignment(e.target.value)}
              disabled={!className}
            >
              <option value="">Select Assignment</option>
              {assignments.map(a => <option key={a._id} value={a._id}>{a.title} ({a.subject})</option>)}
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-400 mb-2">Total Marks (Applies to all)</label>
            <input 
              type="number" 
              className="form-control" 
              value={globalTotalMarks} 
              onChange={(e) => setGlobalTotalMarks(e.target.value)} 
              min="1"
            />
          </div>

          <div className="w-full md:w-auto">
            <button 
              className="btn btn-primary w-full md:w-auto" 
              onClick={handleSaveAll} 
              disabled={!selectedAssignment || students.length === 0 || saving}
            >
              {saving ? 'Saving...' : 'Submit All Grades'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-slate-400">Loading roster...</div>
      ) : students.length > 0 && selectedAssignment ? (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-bg-dark/50">
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider w-24">Roll No</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Student Name</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider w-40">Marks Obtained</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">Grade</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Feedback (Optional)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {students.map(student => {
                  const data = gradesData[student._id] || { marksObtained: '', feedback: '' };
                  const { letterGrade } = calculateGrade(data.marksObtained, globalTotalMarks);
                  const gradeColor = getGradeColor(letterGrade);

                  return (
                    <tr key={student._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <span className="badge badge-primary">{student.rollNumber}</span>
                      </td>
                      <td className="py-4 px-6 font-medium">{student.name}</td>
                      <td className="py-4 px-6">
                        <input
                          type="number"
                          className="form-control py-2 text-center w-full"
                          placeholder="0"
                          value={data.marksObtained}
                          onChange={(e) => handleInputChange(student._id, 'marksObtained', e.target.value)}
                          max={globalTotalMarks}
                          min="0"
                        />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className={`font-bold text-lg w-10 h-10 mx-auto flex items-center justify-center rounded-lg border ${gradeColor}`}>
                          {letterGrade}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          className="form-control py-2 w-full"
                          placeholder="Great job..."
                          value={data.feedback}
                          onChange={(e) => handleInputChange(student._id, 'feedback', e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GradeEntry;
