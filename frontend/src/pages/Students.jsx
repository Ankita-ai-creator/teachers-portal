import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getStudents, deleteStudent } from '../api/students';
import StudentTable from '../components/students/StudentTable';
import Pagination from '../components/Pagination';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [className, setClassName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, className, page]);

  useEffect(() => {
    setPage(1);
  }, [search, className]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents({ search, className, page, limit: 10 });
      setStudents(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/students/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await deleteStudent(id);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (err) {
        toast.error('Failed to delete student');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Students</h1>
          <p className="text-slate-400 mt-1">Manage all registered students</p>
        </div>
        <button 
          onClick={() => navigate('/students/new')} 
          className="btn btn-primary"
        >
          <FiPlus className="text-lg" /> Add Student
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          className="form-control flex-1"
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
      </div>

      <div className="card p-0 overflow-hidden mb-6">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading students...</div>
        ) : (
          <StudentTable 
            students={students} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      <Pagination pagination={pagination} setPage={setPage} />
    </div>
  );
};

export default Students;
