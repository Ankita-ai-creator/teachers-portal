import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { teacher, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-accent-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!teacher) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
