import React, { useState } from 'react';
import { User, Lock, Shield, Users, Settings, FileText, Home, Calendar, Phone, Mail, Edit3, Camera, Menu } from 'lucide-react';
import AdminSidebar from '../components/sidebar';


export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminData = {
    name: "Admin User",
    email: "admin@cityregistry.gov",
    phone: "+1 (555) 987-6543",
    id: "ADMIN-001",
    registrationDate: "January 10, 2023",
    role: "Super Administrator",
    permissions: ["Full Access", "User Management", "Property Approval", "Document Verification"],
    lastLogin: "Today at 2:45 PM"
  };

  const recentActivities = [
    { action: "Approved property registration", time: "2 hours ago", reference: "PROP-2024-0456" },
    { action: "Rejected document submission", time: "5 hours ago", reference: "DOC-2024-0789" },
    { action: "Reset user password", time: "Yesterday", reference: "USER-2024-0345" },
    { action: "Updated system settings", time: "2 days ago", reference: "SYSTEM-001" }
  ];

  const systemStats = {
    totalUsers: 1245,
    activeProperties: 8765,
    pendingApprovals: 23,
    verifiedDocuments: 5432
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-blue-600 p-2 rounded-md hover:bg-blue-50"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Admin Profile</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                {/* Admin Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {adminData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">{adminData.name}</h3>
                  <p className="text-sm text-gray-600">ID: {adminData.id}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mt-2">
                    <Shield className="w-4 h-4 mr-1" />
                    {adminData.role}
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: 'Admin Profile', icon: User },
                    { id: 'activities', label: 'Recent Activities', icon: Users },
                    { id: 'security', label: 'Security Settings', icon: Lock }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === id
                          ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Admin Information</h2>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            defaultValue={adminData.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{adminData.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        {isEditing ? (
                          <input 
                            type="email" 
                            defaultValue={adminData.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center py-2">
                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-900">{adminData.email}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        {isEditing ? (
                          <input 
                            type="tel" 
                            defaultValue={adminData.phone}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center py-2">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-900">{adminData.phone}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                        <div className="flex items-center py-2">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <p className="text-gray-900">{adminData.registrationDate}</p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                        <div className="flex flex-wrap gap-2 py-2">
                          {adminData.permissions.map((permission, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                        <p className="text-gray-900 py-2">{adminData.lastLogin}</p>
                      </div>
                    </div>

                    {/* System Statistics */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">System Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600">Total Users</p>
                          <p className="text-2xl font-bold text-blue-800">{systemStats.totalUsers.toLocaleString()}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600">Active Properties</p>
                          <p className="text-2xl font-bold text-green-800">{systemStats.activeProperties.toLocaleString()}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm text-yellow-600">Pending Approvals</p>
                          <p className="text-2xl font-bold text-yellow-800">{systemStats.pendingApprovals}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-purple-600">Verified Documents</p>
                          <p className="text-2xl font-bold text-purple-800">{systemStats.verifiedDocuments.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-6 flex space-x-4">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                          Save Changes
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'activities' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900">{activity.action}</h4>
                          <p className="text-sm text-gray-600 mt-1">Reference: {activity.reference}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button className="text-purple-600 hover:text-purple-800 font-medium">
                      View All Activities
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input 
                            type="password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700">Status: <span className="font-medium">Disabled</span></p>
                          <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Login History</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span>Today, 2:45 PM</span>
                          </div>
                          <span className="text-gray-500">192.168.1.1 (This device)</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span>Yesterday, 11:23 AM</span>
                          </div>
                          <span className="text-gray-500">192.168.1.1</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                            <span>2 days ago, 3:12 PM</span>
                          </div>
                          <span className="text-gray-500">45.67.89.123 (New York, US)</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                          View Full History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}