import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createStudent, getStudentById, updateStudent } from '../api/students';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const GENDERS = ['Male', 'Female', 'Other'];

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      rollNumber: '',
      className: '',
      email: '',
      parentContact: '',
      gender: '',
      dateOfBirth: '',
    }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchStudent = async () => {
        try {
          const res = await getStudentById(id);
          const student = res.data;
          
          // Format date to YYYY-MM-DD for date input
          const formattedDate = student.dateOfBirth 
            ? new Date(student.dateOfBirth).toISOString().split('T')[0] 
            : '';

          reset({
            name: student.name,
            rollNumber: student.rollNumber,
            className: student.className,
            email: student.email,
            parentContact: student.parentContact,
            gender: student.gender,
            dateOfBirth: formattedDate,
          });
        } catch (err) {
          toast.error('Failed to load student data');
          navigate('/');
        }
      };
      fetchStudent();
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateStudent(id, data);
        toast.success('Student updated successfully!');
      } else {
        await createStudent(data);
        toast.success('Student added successfully!');
      }
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors[0].message);
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{isEdit ? 'Edit Student' : 'Add New Student'}</h1>
          <p className="text-slate-400 mt-1">{isEdit ? 'Update student records' : 'Register a new student'}</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="e.g. John Doe"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
            />
            {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Roll Number</label>
              <input
                type="text"
                className={`form-control ${errors.rollNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g. 101"
                {...register('rollNumber', { required: 'Roll number is required' })}
              />
              {errors.rollNumber && <span className="text-red-400 text-sm">{errors.rollNumber.message}</span>}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Class</label>
              <select
                className={`form-control ${errors.className ? 'border-red-500 focus:border-red-500' : ''}`}
                {...register('className', { required: 'Class is required' })}
              >
                <option value="">Select Class</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              {errors.className && <span className="text-red-400 text-sm">{errors.className.message}</span>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Gender</label>
              <select
                className={`form-control ${errors.gender ? 'border-red-500 focus:border-red-500' : ''}`}
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="">Select Gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && <span className="text-red-400 text-sm">{errors.gender.message}</span>}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Date of Birth</label>
              <input
                type="date"
                className={`form-control ${errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : ''}`}
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
              />
              {errors.dateOfBirth && <span className="text-red-400 text-sm">{errors.dateOfBirth.message}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="e.g. john@example.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <label>Parent Contact Number</label>
            <input
              type="tel"
              className={`form-control ${errors.parentContact ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="e.g. 9876543210"
              {...register('parentContact', { 
                required: 'Parent contact is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Must be exactly 10 digits'
                }
              })}
            />
            {errors.parentContact && <span className="text-red-400 text-sm">{errors.parentContact.message}</span>}
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Save Student'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
