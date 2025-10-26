import { NavLink } from 'react-router';
import { Home, Users, FileText } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-soft border-b border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://mocha-cdn.com/019a2000-9700-777e-86e6-a314058ccd45/datadesk-logo.png" 
              alt="DataDesk Logo" 
              className="w-10 h-10 rounded-lg shadow-soft"
            />
            <h1 className="text-xl font-bold text-neutral-900">
              DataDesk
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-soft'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              <Home className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/researchers"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-soft'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              <Users className="w-4 h-4" />
              Researchers
            </NavLink>
            <NavLink
              to="/research-papers"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-soft'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                }`
              }
            >
              <FileText className="w-4 h-4" />
              Research Papers
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
