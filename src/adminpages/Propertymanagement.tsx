import React, { useState, ChangeEvent } from 'react';
import { Search, Plus, MapPin, Home, Edit, Trash2, Eye, Filter, Camera, X, Menu, Bell } from 'lucide-react';
import AdminSidebar from '../components/sidebar';

type PropertyType = 'Residential' | 'Commercial' | 'Industrial';
type PropertyStatus = 'Registered' | 'Pending' | 'Rejected';

interface Property {
  id: number;
  address: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  owner: string;
  registrationDate: string;
  coordinates: { lat: number; lng: number };
  bedrooms: number;
  bathrooms: number;
  area: string;
  images: string[];
}

interface NewProperty {
  address: string;
  propertyType: PropertyType;
  owner: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  images: string[];
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      address: "123 Main Street, Downtown",
      propertyType: "Residential",
      status: "Registered",
      owner: "John Smith",
      registrationDate: "2024-01-15",
      coordinates: { lat: -17.8252, lng: 31.0335 },
      bedrooms: 3,
      bathrooms: 2,
      area: "150 sqm",
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop"]
    },
    {
      id: 2,
      address: "456 Oak Avenue, Suburb",
      propertyType: "Commercial",
      status: "Pending",
      owner: "ABC Corp Ltd",
      registrationDate: "2024-02-20",
      coordinates: { lat: -17.8292, lng: 31.0375 },
      bedrooms: 0,
      bathrooms: 3,
      area: "300 sqm",
      images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop"]
    },
    {
      id: 3,
      address: "789 Pine Road, Industrial",
      propertyType: "Industrial",
      status: "Registered",
      owner: "Manufacturing Co",
      registrationDate: "2024-01-10",
      coordinates: { lat: -17.8312, lng: 31.0395 },
      bedrooms: 0,
      bathrooms: 1,
      area: "1200 sqm",
      images: ["https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop"]
    }
  ]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [newProperty, setNewProperty] = useState<NewProperty>({
    address: '',
    propertyType: 'Residential',
    owner: '',
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    images: []
  });

  const handleAddProperty = () => {
    if (!newProperty.address || !newProperty.owner) return;
    
    const property: Property = {
      id: Date.now(),
      ...newProperty,
      status: 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      coordinates: { lat: -17.8252 + Math.random() * 0.01, lng: 31.0335 + Math.random() * 0.01 }
    };
    setProperties([...properties, property]);
    setNewProperty({
      address: '',
      propertyType: 'Residential',
      owner: '',
      bedrooms: 0,
      bathrooms: 0,
      area: '',
      images: []
    });
    setShowAddForm(false);
  };

  const handleDeleteProperty = (id: number) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewProperty({
      ...newProperty,
      images: [...newProperty.images, ...imageUrls]
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = newProperty.images.filter((_, i) => i !== index);
    setNewProperty({
      ...newProperty,
      images: updatedImages
    });
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'Registered': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-xl font-bold text-gray-800">Property Management</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Property Management Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 hidden lg:block">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Management System</h1>
              <p className="text-gray-600">Mapping and Housing Registration Portal</p>
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
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Registered">Registered</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
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
                    <p className="text-2xl font-semibold text-gray-900">{properties.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Registered</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {properties.filter(p => p.status === 'Registered').length}
                    </p>
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
                    <p className="text-2xl font-semibold text-gray-900">
                      {properties.filter(p => p.status === 'Pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Search className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Filtered Results</p>
                    <p className="text-2xl font-semibold text-gray-900">{filteredProperties.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Property Listings</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {property.images && property.images.length > 0 && (
                              <img 
                                src={property.images[0]} 
                                alt="Property" 
                                className="w-12 h-12 rounded-lg object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{property.address}</div>
                              <div className="text-sm text-gray-500">
                                {property.bedrooms > 0 && `${property.bedrooms}BR, `}
                                {property.bathrooms}BA • {property.area}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{property.owner}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {property.propertyType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{property.registrationDate}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="text-blue-600 hover:text-blue-800 p-1"
                              onClick={() => setSelectedProperty(property)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800 p-1"
                              onClick={() => handleDeleteProperty(property.id)}
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

            {/* Add Property Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">Add New Property</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProperty.propertyType}
                        onChange={(e) => setNewProperty({...newProperty, propertyType: e.target.value as PropertyType})}
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProperty.owner}
                        onChange={(e) => setNewProperty({...newProperty, owner: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.bedrooms}
                          onChange={(e) => setNewProperty({...newProperty, bedrooms: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.bathrooms}
                          onChange={(e) => setNewProperty({...newProperty, bathrooms: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                      <input
                        type="text"
                        placeholder="e.g., 150 sqm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProperty.area}
                        onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                      />
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
                      
                      {/* Image Preview Grid */}
                      {newProperty.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {newProperty.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Property ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          id="image-upload"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Click to upload images</span>
                          <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB each</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleAddProperty}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Add Property
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Details Modal */}
            {selectedProperty && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                  
                  {/* Images Section */}
                  {selectedProperty.images && selectedProperty.images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-3">Property Images</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProperty.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Address: </span>
                      <span className="text-gray-900">{selectedProperty.address}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Owner: </span>
                      <span className="text-gray-900">{selectedProperty.owner}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type: </span>
                      <span className="text-gray-900">{selectedProperty.propertyType}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status: </span>
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedProperty.status)}`}>
                        {selectedProperty.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Registration Date: </span>
                      <span className="text-gray-900">{selectedProperty.registrationDate}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Coordinates: </span>
                      <span className="text-gray-900">
                        {selectedProperty.coordinates.lat}, {selectedProperty.coordinates.lng}
                      </span>
                    </div>
                    {selectedProperty.bedrooms > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Bedrooms: </span>
                        <span className="text-gray-900">{selectedProperty.bedrooms}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Bathrooms: </span>
                      <span className="text-gray-900">{selectedProperty.bathrooms}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Area: </span>
                      <span className="text-gray-900">{selectedProperty.area}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;