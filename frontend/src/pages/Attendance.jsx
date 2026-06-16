import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getStudents, saveAttendance } from '../api/students';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const Attendance = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [className, setClassName] = useState('1st');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (className && date) {
      fetchStudents();
    }
  }, [className, date]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents({ className, limit: 100 });
      const studentData = res.data;
      setStudents(studentData);
      
      const initialAttendance = {};
      studentData.forEach(student => {
        const record = student.attendanceRecords?.find(
          ar => new Date(ar.date).toISOString().split('T')[0] === date
        );
        initialAttendance[student._id] = record ? record.status : 'present';
      });
      setAttendance(initialAttendance);
    } catch (err) {
      toast.error('Failed to fetch students for attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Build the bulk payload array
      const records = students.map(student => ({
        studentId: student._id,
        date: date,
        status: attendance[student._id]
      }));
      
      await saveAttendance(records);
      toast.success('Attendance saved successfully!');
    } catch (err) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Mark Attendance</h1>
        <p className="text-slate-400 mt-1">Record daily attendance for classes</p>
      </div>

      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-400 mb-2">Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-400 mb-2">Class</label>
            <select 
              className="form-control" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)}
            >
              {CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
            </select>
          </div>
          <div className="w-full md:w-auto">
            <button 
              className="btn btn-primary w-full md:w-auto" 
              onClick={handleSaveAll} 
              disabled={students.length === 0 || saving}
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No students found in this class.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider w-24">Roll No</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {students.map(student => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="badge badge-primary">{student.rollNumber}</span>
                    </td>
                    <td className="py-4 px-6 font-medium">{student.name}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          className={`btn ${attendance[student._id] === 'present' ? 'btn-success' : 'btn-secondary'} px-4 py-1.5`}
                          onClick={() => handleToggle(student._id, 'present')}
                        >
                          Present
                        </button>
                        <button 
                          className={`btn ${attendance[student._id] === 'absent' ? 'btn-danger' : 'btn-secondary'} px-4 py-1.5`}
                          onClick={() => handleToggle(student._id, 'absent')}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
