import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import AssignmentForm from './pages/AssignmentForm';
import SubmissionTracker from './pages/SubmissionTracker';
import GradeEntry from './pages/GradeEntry';
import GradeAnalytics from './pages/GradeAnalytics';
import ReportCard from './pages/ReportCard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-6">Page not found</p>
      <Link
        to="/dashboard"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col font-sans">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-7xl pb-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/students/new" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
              <Route path="/students/:id/edit" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
              <Route path="/assignments/new" element={<ProtectedRoute><AssignmentForm /></ProtectedRoute>} />
              <Route path="/assignments/:id/edit" element={<ProtectedRoute><AssignmentForm /></ProtectedRoute>} />
              <Route path="/assignments/:id/submissions" element={<ProtectedRoute><SubmissionTracker /></ProtectedRoute>} />
              <Route path="/grades/entry" element={<ProtectedRoute><GradeEntry /></ProtectedRoute>} />
              <Route path="/grades/analytics" element={<ProtectedRoute><GradeAnalytics /></ProtectedRoute>} />
              <Route path="/students/:id/report-card" element={<ProtectedRoute><ReportCard /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;