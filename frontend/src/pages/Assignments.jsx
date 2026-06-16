import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAssignments, deleteAssignment } from '../api/assignments';
import AssignmentCard from '../components/assignments/AssignmentCard';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await getAssignments({ className, subject });
      setAssignments(res.data);
    } catch (err) {
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignments();
    }, 300);
    return () => clearTimeout(timer);
  }, [className, subject]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
        toast.success('Assignment deleted');
        fetchAssignments();
      } catch (err) {
        toast.error('Failed to delete assignment');
      }
    }
  };

  const handleViewSubmissions = (id) => {
    navigate(`/assignments/${id}/submissions`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Assignments</h1>
          <p className="text-slate-400 mt-1">Manage class homework and tasks</p>
        </div>
        <Link to="/assignments/new" className="btn btn-primary">
          <FiPlus className="text-lg" /> Create Assignment
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select
          className="form-control sm:w-48"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          <option value="">All Classes</option>
          {CLASSES.map((cls) => (
            <option key={cls} value={cls}>Class {cls}</option>
          ))}
        </select>
        <input
          type="text"
          className="form-control flex-1 max-w-sm"
          placeholder="Filter by subject (e.g. Math)..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading assignments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.length === 0 ? (
            <div className="col-span-full card text-center py-16">
              <p className="text-slate-400">No assignments found matching the criteria.</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                onDelete={handleDelete}
                onViewSubmissions={handleViewSubmissions}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Assignments;
