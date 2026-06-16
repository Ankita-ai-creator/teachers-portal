import React, { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiClock, FiCalendar } from 'react-icons/fi';
import { getDashboardStats } from '../api/dashboard';
import StatCard from '../components/dashboard/StatCard';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import GradeChart from '../components/dashboard/GradeChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-accent-primary rounded-full animate-spin"></div>
        <p className="text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center p-12">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto mb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<FiUsers />} 
          color="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <StatCard 
          title="Total Classes" 
          value={stats.totalClasses} 
          icon={<FiBook />} 
          color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard 
          title="Pending Assignments" 
          value={stats.pendingAssignments} 
          icon={<FiClock />} 
          color="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
        <StatCard 
          title="Today's Classes" 
          value={stats.todaysClasses} 
          icon={<FiCalendar />} 
          color="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Charts Column (Left/Top) */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <AttendanceChart data={stats.attendanceChartData} />
            </div>
            <div className="flex-1 min-w-0">
              <GradeChart data={stats.gradeChartData} />
            </div>
          </div>
        </div>

        {/* Activity Feed Column (Right/Bottom) */}
        <div className="xl:w-96 w-full shrink-0">
          <ActivityFeed activities={stats.activityFeed} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
