import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="card flex items-center p-6 gap-6">
      <div className={`p-4 rounded-xl text-3xl shadow-inner ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
