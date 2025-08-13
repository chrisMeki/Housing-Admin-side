import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Home, 
  Calendar,
  Search,
  Filter,
  Plus,
  Menu,
  Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import AdminSidebar from '../components/sidebar';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Monthly Housing Registration Report - July 2025',
      type: 'Monthly Report',
      uploadDate: '2025-08-10',
      fileSize: '2.4 MB',
      status: 'Published',
      downloads: 47
    },
    {
      id: 2,
      title: 'Property Mapping Analysis Q2 2025',
      type: 'Quarterly Report',
      uploadDate: '2025-07-15',
      fileSize: '5.1 MB',
      status: 'Published',
      downloads: 92
    },
    {
      id: 3,
      title: 'Housing Compliance Assessment',
      type: 'Compliance Report',
      uploadDate: '2025-08-05',
      fileSize: '1.8 MB',
      status: 'Draft',
      downloads: 0
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Analytics data
  const registrationData = [
    { month: 'Jan', registrations: 120, properties: 95 },
    { month: 'Feb', registrations: 145, properties: 110 },
    { month: 'Mar', registrations: 160, properties: 125 },
    { month: 'Apr', registrations: 138, properties: 105 },
    { month: 'May', registrations: 175, properties: 140 },
    { month: 'Jun', registrations: 195, properties: 155 },
    { month: 'Jul', registrations: 210, properties: 170 }
  ];

  const propertyTypeData = [
    { name: 'Residential', value: 650, color: '#3b82f6' },
    { name: 'Commercial', value: 180, color: '#10b981' },
    { name: 'Industrial', value: 85, color: '#f59e0b' },
    { name: 'Mixed Use', value: 45, color: '#ef4444' }
  ];

  const statusData = [
    { status: 'Approved', count: 425 },
    { status: 'Pending', count: 180 },
    { status: 'Under Review', count: 95 },
    { status: 'Rejected', count: 32 }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newReport = {
        id: reports.length + 1,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: 'Custom Report',
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Draft',
        downloads: 0
      };
      setReports([...reports, newReport]);
    }
  };

  const handleDeleteReport = (id) => {
    setReports(reports.filter(report => report.id !== id));
  };

  const handlePublishReport = (id) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: 'Published' } : report
    ));
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-xl font-bold text-gray-800">Reports & Analytics</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="bg-white shadow-sm border-b hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">Manage housing registration reports and view system analytics</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Reports Management
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics Dashboard
              </button>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'reports' && (
            <div>
              {/* Reports Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
                  >
                    <option value="all">All Types</option>
                    <option value="monthly">Monthly Reports</option>
                    <option value="quarterly">Quarterly Reports</option>
                    <option value="compliance">Compliance Reports</option>
                    <option value="custom">Custom Reports</option>
                  </select>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center w-full md:w-auto justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Report
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                />
              </div>

              {/* Reports Table */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Report Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Upload Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{report.title}</div>
                                <div className="text-xs text-gray-500 md:hidden">
                                  {report.type} • {new Date(report.uploadDate).toLocaleDateString()} • {report.fileSize}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {report.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {new Date(report.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {report.fileSize}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              report.status === 'Published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {report.downloads}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Download className="w-4 h-4" />
                              </button>
                              {report.status === 'Draft' && (
                                <button 
                                  onClick={() => handlePublishReport(report.id)}
                                  className="text-purple-600 hover:text-purple-900 text-xs bg-purple-100 px-2 py-1 rounded"
                                >
                                  Publish
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteReport(report.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Registrations"
                  value="1,243"
                  change={12.5}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Properties Mapped"
                  value="960"
                  change={8.3}
                  icon={Home}
                  color="green"
                />
                <StatCard
                  title="Pending Reviews"
                  value="180"
                  change={-5.2}
                  icon={Calendar}
                  color="yellow"
                />
                <StatCard
                  title="Reports Generated"
                  value="47"
                  change={15.8}
                  icon={FileText}
                  color="purple"
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Registration Trends */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Trends</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={registrationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="properties" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Property Types */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={propertyTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
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
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {propertyTypeData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Overview</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;