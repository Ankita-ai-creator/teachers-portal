import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';

const StudentTable = ({ students, onEdit, onDelete }) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No students found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Roll No</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Name</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Class</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Gender</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
            <th className="py-4 px-6 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {students.map((student) => (
            <tr key={student._id} className="hover:bg-slate-800/30 transition-colors">
              <td className="py-4 px-6">
                <span className="badge badge-primary">{student.rollNumber}</span>
              </td>
              <td className="py-4 px-6 font-medium">{student.name}</td>
              <td className="py-4 px-6 text-slate-300">Class {student.className}</td>
              <td className="py-4 px-6 text-slate-300">{student.gender}</td>
              <td className="py-4 px-6 text-slate-400 text-sm">
                <div>{student.email}</div>
                <div>{student.parentContact}</div>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <Link 
                    to={`/students/${student._id}/report-card`}
                    className="btn btn-success !p-2"
                    title="View Report Card"
                  >
                    <FiFileText />
                  </Link>
                  <button 
                    onClick={() => onEdit(student._id)} 
                    className="btn btn-secondary !p-2"
                    title="Edit Student"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={() => onDelete(student._id)} 
                    className="btn btn-danger !p-2"
                    title="Delete Student"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
