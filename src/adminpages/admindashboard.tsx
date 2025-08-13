import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Users, MapPin, TrendingUp, Menu, Bell, X } from 'lucide-react';
import AdminSidebar from '../components/sidebar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data for charts
  const housingData = [
    { month: 'Jan', registered: 145, approved: 120, pending: 25 },
    { month: 'Feb', registered: 168, approved: 140, pending: 28 },
    { month: 'Mar', registered: 192, approved: 165, pending: 27 },
    { month: 'Apr', registered: 210, approved: 180, pending: 30 },
    { month: 'May', registered: 245, approved: 220, pending: 25 },
    { month: 'Jun', registered: 280, approved: 250, pending: 30 },
  ];

  const regionData = [
    { region: 'North', registrations: 450 },
    { region: 'South', registrations: 380 },
    { region: 'East', registrations: 290 },
    { region: 'West', registrations: 520 },
    { region: 'Central', registrations: 340 },
  ];

  const propertyTypeData = [
    { name: 'Apartments', value: 45, color: '#8884d8' },
    { name: 'Houses', value: 30, color: '#82ca9d' },
    { name: 'Condos', value: 15, color: '#ffc658' },
    { name: 'Townhouses', value: 10, color: '#ff7300' },
  ];

  const recentRegistrations = [
    { id: '001', address: '123 Oak Street', type: 'House', status: 'Approved', date: '2024-08-10' },
    { id: '002', address: '456 Pine Avenue', type: 'Apartment', status: 'Pending', date: '2024-08-09' },
    { id: '003', address: '789 Maple Drive', type: 'Condo', status: 'Review', date: '2024-08-08' },
    { id: '004', address: '321 Elm Street', type: 'Townhouse', status: 'Approved', date: '2024-08-07' },
    { id: '005', address: '654 Cedar Lane', type: 'House', status: 'Pending', date: '2024-08-06' },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs md:text-sm mt-1 md:mt-2 flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-2 md:p-3 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Review': 'bg-blue-100 text-blue-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[17rem]' : 'lg:ml-[17rem]'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6 lg:ml-4">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard
                title="Total Registrations"
                value="1,280"
                icon={Home}
                trend={12}
                color="bg-blue-500"
              />
              <StatCard
                title="Approved Properties"
                value="1,075"
                icon={Users}
                trend={8}
                color="bg-green-500"
              />
              <StatCard
                title="Pending Reviews"
                value="165"
                icon={MapPin}
                trend={-3}
                color="bg-yellow-500"
              />
              <StatCard
                title="Active Regions"
                value="5"
                icon={TrendingUp}
                trend={0}
                color="bg-purple-500"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Housing Registrations Chart */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Monthly Registrations</h3>
                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={housingData}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="registered" fill="#3b82f6" name="Registered" />
                      <Bar dataKey="approved" fill="#10b981" name="Approved" />
                      <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Registrations by Region</h3>
                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={regionData} 
                      layout="horizontal"
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="region" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="registrations" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Property Types and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Property Types Pie Chart */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Property Types Distribution</h3>
                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Registrations */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Recent Registrations</h3>
                <div className="space-y-2 md:space-y-3">
                  {recentRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{registration.address}</p>
                        <p className="text-xs md:text-sm text-gray-600 truncate">{registration.type} • {registration.date}</p>
                      </div>
                      <span className={getStatusBadge(registration.status)}>
                        {registration.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;