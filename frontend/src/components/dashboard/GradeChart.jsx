import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GradeChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="font-semibold text-slate-200">{label}</p>
          <p className="text-accent-primary font-medium mt-1">
            Average Grade: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-full">
      <h2 className="text-lg font-semibold mb-6">Subject Performance</h2>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/50">
          No grade data available
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
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
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GradeChart;
