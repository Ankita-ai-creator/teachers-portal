import React from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { FiEdit2, FiTrash2, FiFile, FiCheckSquare } from 'react-icons/fi';

const AssignmentCard = ({ assignment, onDelete, onViewSubmissions }) => {
  const getStatusBadge = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return <span className="badge badge-danger">Overdue</span>;
    }
    if (isToday(date)) {
      return <span className="badge badge-warning">Due Today</span>;
    }
    return <span className="badge badge-success">Upcoming</span>;
  };

  return (
    <div className="card flex flex-col justify-between hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-center mb-3">
          {getStatusBadge(assignment.dueDate)}
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Class {assignment.className} • {assignment.subject}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-1" title={assignment.title}>
          {assignment.title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2" title={assignment.description}>
          {assignment.description}
        </p>
        
        <div className="text-sm mb-6 bg-slate-800/50 p-3 rounded-md">
          <div className={`font-medium ${isPast(new Date(assignment.dueDate)) && !isToday(new Date(assignment.dueDate)) ? 'text-red-400' : 'text-slate-200'}`}>
            Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy h:mm a')}
          </div>
          <div className="text-slate-400 text-xs mt-1">
            {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {assignment.attachmentUrl && (
          <a href={assignment.attachmentUrl} target="_blank" rel="noreferrer" className="btn btn-secondary w-full mb-3">
            <FiFile /> View Attachment
          </a>
        )}
        
        <div className="flex gap-2">
          <button onClick={() => onViewSubmissions(assignment._id)} className="btn btn-primary flex-1">
            <FiCheckSquare /> Submissions ({assignment.submittedBy.length})
          </button>
          <Link to={`/assignments/${assignment._id}/edit`} className="btn btn-secondary px-3" title="Edit">
            <FiEdit2 />
          </Link>
          <button onClick={() => onDelete(assignment._id)} className="btn btn-danger px-3" title="Delete">
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
