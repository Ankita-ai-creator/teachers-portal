import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUsers, FiClipboard, FiFileText, FiAward, FiBarChart2, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const isHome = location.pathname === '/' || location.pathname.startsWith('/students');

  return (
    <nav className="bg-bg-card border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold gradient-text">
            Teachers Portal
          </Link>
          
          <ul className="flex gap-2 md:gap-6">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard') ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FiHome /> <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isHome ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FiUsers /> <span className="hidden sm:inline">Students</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/attendance" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('/attendance') ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FiClipboard /> <span className="hidden sm:inline">Attendance</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/assignments" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('/assignments') ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FiFileText /> <span className="hidden sm:inline">Assignments</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/grades/entry" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('/grades/entry') ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FiAward /> <span className="hidden sm:inline">Grades</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/grades/analytics" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('/grades/analytics') ? 'text-accent-primary bg-accent-primary/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FiBarChart2 /> <span className="hidden sm:inline">Analytics</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
