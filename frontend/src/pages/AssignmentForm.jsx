import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createAssignment, getAssignmentById, updateAssignment } from '../api/assignments';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const AssignmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      className: '',
      subject: '',
      dueDate: '',
    }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchAssignment = async () => {
        try {
          const res = await getAssignmentById(id);
          const assignment = res.data;
          
          const formattedDate = assignment.dueDate 
            ? new Date(assignment.dueDate).toISOString().slice(0, 16)
            : '';

          reset({
            title: assignment.title,
            description: assignment.description,
            className: assignment.className,
            subject: assignment.subject,
            dueDate: formattedDate,
          });
        } catch (err) {
          toast.error('Failed to load assignment data');
          navigate('/assignments');
        }
      };
      fetchAssignment();
    }
  }, [id, isEdit, reset, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.keys(data).forEach(key => {
        submitData.append(key, data[key]);
      });
      
      if (file) {
        submitData.append('attachment', file);
      }

      if (isEdit) {
        await updateAssignment(id, submitData);
        toast.success('Assignment updated successfully!');
      } else {
        await createAssignment(submitData);
        toast.success('Assignment created successfully!');
      }
      navigate('/assignments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{isEdit ? 'Edit Assignment' : 'Create Assignment'}</h1>
          <p className="text-slate-400 mt-1">{isEdit ? 'Update assignment details' : 'Post a new assignment'}</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Title</label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="e.g. Math Homework Ch. 3"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <span className="text-red-400 text-sm">{errors.title.message}</span>}
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              className={`form-control min-h-[100px] ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="Details about the assignment..."
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <span className="text-red-400 text-sm">{errors.description.message}</span>}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
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

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Subject</label>
              <input
                type="text"
                className={`form-control ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g. Mathematics"
                {...register('subject', { required: 'Subject is required' })}
              />
              {errors.subject && <span className="text-red-400 text-sm">{errors.subject.message}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Due Date & Time</label>
            <input
              type="datetime-local"
              className={`form-control ${errors.dueDate ? 'border-red-500 focus:border-red-500' : ''}`}
              {...register('dueDate', { required: 'Due date is required' })}
            />
            {errors.dueDate && <span className="text-red-400 text-sm">{errors.dueDate.message}</span>}
          </div>

          <div className="input-group">
            <label>Attachment (Optional)</label>
            <input
              type="file"
              className="form-control px-3 py-2 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Save Assignment'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/assignments')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
