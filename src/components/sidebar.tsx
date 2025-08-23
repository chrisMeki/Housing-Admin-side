import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Home, Search, Users, List, Bell, FileText, BarChart3, User, ChevronRight, X } from 'lucide-react';
// @ts-ignorenp
import logo from '../assets/logo.png'; // Make sure to import your logo

export default function ({ isOpen = true, onClose = () => {} }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainMenuItems = [
    { id: 'dashboard', label: 'Admin Dashboard', path: '/dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'users', label: 'User Management', path: '/users', icon: Users, color: 'text-green-500' },
    { id: 'properties', label: 'Property Management', path: '/properties', icon: Map, color: 'text-yellow-500' },
    { id: 'registration', label: 'Registration Management', path: '/registration', icon: User, color: 'text-purple-500' },
    { id: 'listings', label: 'Admin Property Listings', path: '/listings', icon: List, color: 'text-pink-500' },
    { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3, color: 'text-red-500' }
  ];

  const bottomMenuItems = [
    
    { id: 'logout', label: 'Admin logout', path: '/logout', icon: User, color: 'text-indigo-500' }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-72'
      } ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Glass container */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-lg border-r border-gray-200/30 shadow-lg overflow-hidden">
          {/* Header with Logo */}
          <div className="p-4 border-b border-gray-200/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    src={logo}
                    alt="city council"
                    className={`${isCollapsed ? 'w-10 h-10' : 'w-30 h-auto'} object-contain transition-all duration-300`}
                  />
                </div>
                {!isCollapsed && (
                  <h1 className="ml-3 text-xl font-bold text-gray-800"></h1>
                )}
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 bg-white p-1 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Main Navigation Menu */}
            <nav className="p-4 flex-1">
              <div className="space-y-2">
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) => 
                        `w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                          isActive 
                            ? 'bg-blue-50/70 border-l-4 border-blue-500 text-blue-700' 
                            : 'hover:bg-gray-50/50 text-gray-700'
                        }`
                      }
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-500'} group-hover:scale-110 transition-transform`} />
                          {!isCollapsed && (
                            <span className="ml-3 font-medium">{item.label}</span>
                          )}
                          {isActive && !isCollapsed && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            {/* Bottom Navigation Menu (Profile) */}
            <nav className="p-4 border-t border-gray-200/30">
              <div className="space-y-2">
                {bottomMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) => 
                        `w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                          isActive 
                            ? 'bg-blue-50/70 border-l-4 border-blue-500 text-blue-700' 
                            : 'hover:bg-gray-50/50 text-gray-700'
                        }`
                      }
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-500'} group-hover:scale-110 transition-transform`} />
                          {!isCollapsed && (
                            <span className="ml-3 font-medium">{item.label}</span>
                          )}
                          {isActive && !isCollapsed && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Custom Animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }

          /* Custom scrollbar for webkit browsers */
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.3);
            border-radius: 3px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(203, 213, 225, 0.5);
            border-radius: 3px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.7);
          }
        `}</style>
      </div>
    </>
  );
}