import React, { useState } from 'react';
import { MapPin, Home, User, Phone, Mail, Calendar, FileText, Plus, Search, Eye, Edit, Filter, Menu, Bell, X } from 'lucide-react';
import AdminSidebar from '../components/sidebar';

interface Coordinates {
  lat: string | number;
  lng: string | number;
}

interface Registration {
  id: string;
  propertyType: string;
  address: string;
  coordinates: Coordinates;
  plotSize: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  nationalId: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_documents';
  notes: string;
  submittedBy: string;
}

interface FormData {
  propertyId: string;
  propertyType: string;
  address: string;
  coordinates: Coordinates;
  plotSize: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  nationalId: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_documents';
  notes: string;
}

export default function HousingRegistrationAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'register'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'requires_documents'>('all');
  
  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      id: 'P-2024-001',
      propertyType: 'residential',
      address: '123 Samora Machel Ave, Harare',
      coordinates: { lat: -17.8292, lng: 31.0522 },
      plotSize: 800,
      bedrooms: 3,
      bathrooms: 2,
      yearBuilt: 2020,
      ownerName: 'John Mukamuri',
      ownerEmail: 'john.mukamuri@email.com',
      ownerPhone: '+263 77 123 4567',
      nationalId: '63-123456A12',
      registrationDate: '2024-08-10',
      status: 'pending',
      notes: 'User submitted registration online',
      submittedBy: 'User'
    },
    {
      id: 'P-2024-002',
      propertyType: 'commercial',
      address: '456 Robert Mugabe Rd, Harare',
      coordinates: { lat: -17.8340, lng: 31.0498 },
      plotSize: 1200,
      bedrooms: 0,
      bathrooms: 4,
      yearBuilt: 2018,
      ownerName: 'Mary Chigwedere',
      ownerEmail: 'mary.chigwedere@business.co.zw',
      ownerPhone: '+263 78 987 6543',
      nationalId: '63-987654B21',
      registrationDate: '2024-08-08',
      status: 'approved',
      notes: 'Commercial property - office building',
      submittedBy: 'User'
    },
    {
      id: 'P-2024-003',
      propertyType: 'residential',
      address: '789 Julius Nyerere Way, Harare',
      coordinates: { lat: -17.8180, lng: 31.0470 },
      plotSize: 600,
      bedrooms: 2,
      bathrooms: 1,
      yearBuilt: 2015,
      ownerName: 'Peter Ndoro',
      ownerEmail: 'peter.ndoro@gmail.com',
      ownerPhone: '+263 71 555 0123',
      nationalId: '63-555123C33',
      registrationDate: '2024-08-12',
      status: 'requires_documents',
      notes: 'Missing title deed documentation',
      submittedBy: 'Admin'
    }
  ]);

  const [formData, setFormData] = useState<FormData>({
    propertyId: '',
    propertyType: 'residential',
    address: '',
    coordinates: { lat: '', lng: '' },
    plotSize: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    nationalId: '',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const newRegistration: Registration = {
      ...formData,
      id: `P-2024-${String(registrations.length + 1).padStart(3, '0')}`,
      submittedBy: 'Admin',
      plotSize: Number(formData.plotSize),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      yearBuilt: Number(formData.yearBuilt),
      coordinates: {
        lat: Number(formData.coordinates.lat),
        lng: Number(formData.coordinates.lng)
      }
    } as Registration;
    
    setTimeout(() => {
      setRegistrations(prev => [newRegistration, ...prev]);
      alert('Property registered successfully!');
      setIsSubmitting(false);
      setActiveView('dashboard');
      
      setFormData({
        propertyId: '',
        propertyType: 'residential',
        address: '',
        coordinates: { lat: '', lng: '' },
        plotSize: '',
        bedrooms: '',
        bathrooms: '',
        yearBuilt: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        nationalId: '',
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: ''
      });
    }, 1500);
  };

  const updateRegistrationStatus = (id: string, newStatus: 'pending' | 'approved' | 'rejected' | 'requires_documents') => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === id ? { ...reg, status: newStatus } : reg
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requires_documents': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
    requires_documents: registrations.filter(r => r.status === 'requires_documents').length
  };

  if (activeView === 'register') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[17rem]' : 'lg:ml-[17rem]'}`}>
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-40">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Register Property</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8 hidden lg:block">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Registration System</h1>
                <p className="text-gray-600">Housing Registration Portal</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Register New Property</h1>
                      <p className="text-gray-600">Add a new property to the system</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Property Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="vacant_land">Vacant Land</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plot Size (m²)
                      </label>
                      <input
                        type="number"
                        name="plotSize"
                        value={formData.plotSize}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1000"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full property address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="lat"
                        value={formData.coordinates.lat}
                        onChange={handleInputChange}
                        step="any"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="-17.8292"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="lng"
                        value={formData.coordinates.lng}
                        onChange={handleInputChange}
                        step="any"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="31.0522"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year Built
                      </label>
                      <input
                        type="number"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                        min="1900"
                        max="2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2020"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Owner Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        National ID
                      </label>
                      <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="63-123456A12"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+263 77 123 4567"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Registration Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Date
                      </label>
                      <input
                        type="date"
                        name="registrationDate"
                        value={formData.registrationDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="requires_documents">Requires Documents</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Additional notes or comments..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveView('dashboard')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registering...' : 'Register Property'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[17rem]' : 'lg:ml-[17rem]'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Housing Registration</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 hidden lg:block">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Housing Registration Dashboard</h1>
              <p className="text-gray-600">Manage property registrations from users and admins</p>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search properties or owners..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="requires_documents">Requires Documents</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Register Property
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Properties</p>
                    <p className="text-2xl font-semibold text-gray-900">{statusCounts.all}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-semibold text-gray-900">{statusCounts.approved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Edit className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{statusCounts.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Needs Docs</p>
                    <p className="text-2xl font-semibold text-gray-900">{statusCounts.requires_documents}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Registered Properties</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{registration.id}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{registration.address}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{registration.ownerName}</div>
                            <div className="text-sm text-gray-500">{registration.ownerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-900">{registration.propertyType.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {registration.registrationDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                            {registration.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${registration.submittedBy === 'User' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {registration.submittedBy}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={registration.status}
                            onChange={(e) => updateRegistrationStatus(registration.id, e.target.value as any)}
                            className="text-xs border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="requires_documents">Needs Docs</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredRegistrations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">No properties found matching your search criteria.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}