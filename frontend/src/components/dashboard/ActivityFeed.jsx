import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FiUserPlus, FiFilePlus, FiActivity } from 'react-icons/fi';

dayjs.extend(relativeTime);

const ActivityFeed = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="card h-full">
        <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
        <div className="text-center py-12 text-slate-500">
          No recent activity found.
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    if (type === 'student') return <FiUserPlus className="text-blue-400" />;
    if (type === 'assignment') return <FiFilePlus className="text-amber-400" />;
    return <FiActivity className="text-slate-400" />;
  };

  const getBgColor = (type) => {
    if (type === 'student') return 'bg-blue-500/10 border-blue-500/20';
    if (type === 'assignment') return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="card h-full bg-slate-800/80">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <FiActivity className="text-accent-secondary" /> Recent Activity
      </h2>
      <div className="flex flex-col gap-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-4 p-4 rounded-xl bg-bg-dark border border-slate-700/50 hover:border-slate-600 transition-colors"
          >
            <div className={`p-3 rounded-lg border ${getBgColor(activity.type)}`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-200 text-sm">{activity.message}</p>
              <p className="text-xs text-slate-400 mt-1">
                {dayjs(activity.timestamp).fromNow()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
