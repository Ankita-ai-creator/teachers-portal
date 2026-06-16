import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getGradeAnalytics } from '../api/grades';
import { FiAward } from 'react-icons/fi';

const CLASSES = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const GradeAnalytics = () => {
  const [className, setClassName] = useState('1st');
  const [analytics, setAnalytics] = useState({ subjectAverages: [], topStudents: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (className) {
      setLoading(true);
      getGradeAnalytics(className)
        .then(res => setAnalytics(res.data))
        .catch(err => toast.error('Failed to load analytics'))
        .finally(() => setLoading(false));
    }
  }, [className]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="font-semibold text-slate-200">{label}</p>
          <p className="text-accent-primary font-medium mt-1">
            Average: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Grade Analytics</h1>
          <p className="text-slate-400 mt-1">Class performance and top student leaderboard</p>
        </div>
        
        <div className="w-full md:w-64">
          <select 
            className="form-control" 
            value={className} 
            onChange={(e) => setClassName(e.target.value)}
          >
            {CLASSES.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-slate-400">Loading analytics data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2">
            <div className="card h-full">
              <h2 className="text-xl font-semibold mb-6">Subject Averages (Class {className})</h2>
              
              {analytics.subjectAverages.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  No grading data available for this class yet.
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.subjectAverages}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis 
                        dataKey="subject" 
                        stroke="#94a3b8" 
                        tick={{fill: '#94a3b8'}} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        tick={{fill: '#94a3b8'}} 
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.4}} />
                      <Bar 
                        dataKey="avgPercentage" 
                        fill="url(#colorGradient)" 
                        radius={[6, 6, 0, 0]} 
                        barSize={40}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Area */}
          <div className="lg:col-span-1">
            <div className="card h-full bg-slate-800/80 border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <FiAward className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">Top Performers</h2>
              </div>

              {analytics.topStudents.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No student rankings available.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {analytics.topStudents.map((student, index) => (
                    <div 
                      key={student.studentId} 
                      className="flex items-center justify-between p-4 rounded-xl bg-bg-dark border border-slate-700/50 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-inner
                          ${index === 0 ? 'bg-amber-500 text-amber-900 shadow-amber-500/50' : 
                            index === 1 ? 'bg-slate-300 text-slate-800 shadow-slate-300/50' : 
                            index === 2 ? 'bg-amber-700 text-amber-100 shadow-amber-700/50' : 
                            'bg-slate-700 text-slate-300'}`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{student.name}</p>
                          <p className="text-xs text-slate-400">Roll: {student.rollNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent-secondary">{student.overallPercentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default GradeAnalytics;
