import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="font-semibold text-slate-200">{label}</p>
          <p className="text-emerald-400 font-medium mt-1">
            Attendance: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-full">
      <h2 className="text-lg font-semibold mb-6">Weekly Attendance</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="day" 
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
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
