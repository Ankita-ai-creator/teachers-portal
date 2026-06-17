import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { getAssignmentById, markSubmission, unmarkSubmission } from '../api/assignments';
import { getStudents } from '../api/students';

const SubmissionTracker = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const assignmentRes = await getAssignmentById(id);
      const assignData = assignmentRes.data;
      setAssignment(assignData);

      const studentsRes = await getStudents({ className: assignData.className, limit: 1000 });
      setStudents(studentsRes.data);
    } catch (error) {
      toast.error('Failed to load submission data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleToggleSubmission = async (studentId, hasSubmitted) => {
    try {
      if (hasSubmitted) {
        await unmarkSubmission(id, studentId);
        toast.info('Marked as pending');
      } else {
        await markSubmission(id, studentId);
        toast.success('Marked as submitted');
      }
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-400">Loading...</div>;
  if (!assignment) return <div className="text-center py-12 text-slate-400">Assignment not found</div>;

  const submittedStudentIds = assignment.submittedBy.map(s => typeof s === 'object' ? s._id : s);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/assignments" className="text-accent-primary hover:text-accent-secondary inline-flex items-center gap-2 mb-4 transition-colors">
          &larr; Back to Assignments
        </Link>
        <h1 className="text-3xl font-bold gradient-text">{assignment.title} - Submissions</h1>
        <p className="text-slate-400 mt-2">
          Class: <span className="text-slate-200">{assignment.className}</span> | Subject: <span className="text-slate-200">{assignment.subject}</span>
        </p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-semibold">Student Roster</h2>
          <div className="badge badge-primary px-4 py-2 text-sm">
            {submittedStudentIds.length} / {students.length} Submitted
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-bg-dark/50">
                <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Roll No</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">No students found in this class.</td>
                </tr>
              ) : (
                students.map(student => {
                  const hasSubmitted = submittedStudentIds.includes(student._id);
                  return (
                    <tr key={student._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <span className="badge badge-primary">{student.rollNumber}</span>
                      </td>
                      <td className="py-4 px-6 font-medium">{student.name}</td>
                      <td className="py-4 px-6 text-center">
                        {hasSubmitted ? (
                          <FiCheckCircle className="inline-block text-emerald-500 text-xl" title="Submitted" />
                        ) : (
                          <FiXCircle className="inline-block text-red-500 text-xl" title="Pending" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          className={`btn ${hasSubmitted ? 'btn-secondary' : 'btn-success'} py-1.5 px-4 text-sm whitespace-nowrap`}
                          onClick={() => handleToggleSubmission(student._id, hasSubmitted)}
                        >
                          {hasSubmitted ? 'Mark Pending' : 'Mark Submitted'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTracker;
