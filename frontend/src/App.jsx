import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl pb-16">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/" element={<Students />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/:id/edit" element={<StudentForm />} />
          <Route path="/attendance" element={<Attendance />} />
          
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignments/new" element={<AssignmentForm />} />
          <Route path="/assignments/:id/edit" element={<AssignmentForm />} />
          <Route path="/assignments/:id/submissions" element={<SubmissionTracker />} />

          <Route path="/grades/entry" element={<GradeEntry />} />
          <Route path="/grades/analytics" element={<GradeAnalytics />} />
          <Route path="/students/:id/report-card" element={<ReportCard />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;
