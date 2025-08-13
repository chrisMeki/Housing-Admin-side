import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Search, Plus, MapPin, Home, Edit, Trash2, Eye, Filter, Camera, X, Menu, Bell, Bed, Bath, Square, User, Phone, Mail } from 'lucide-react';
import AdminSidebar from '../components/sidebar';

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  image: string;
  user: User;
  listedDate: string;
}

const PropertyListings = () => {
  // Sample initial data
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      price: 250000,
      location: "Downtown, New York",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      type: "Apartment",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
      user: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567"
      },
      listedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Cozy Suburban House",
      price: 450000,
      location: "Brooklyn Heights, NY",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      type: "House",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=250&fit=crop",
      user: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 987-6543"
      },
      listedDate: "2024-01-20"
    },
    {
      id: 3,
      title: "Luxury Penthouse",
      price: 850000,
      location: "Manhattan, NY",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      type: "Penthouse",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
      user: {
        name: "Michael Davis",
        email: "m.davis@email.com",
        phone: "+1 (555) 456-7890"
      },
      listedDate: "2024-01-25"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Omit<Property, 'id' | 'listedDate'> & { id?: number, imageFile?: File | null }>({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    type: 'Apartment',
    image: '',
    user: {
      name: '',
      email: '',
      phone: ''
    },
    imageFile: null
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse', 'Penthouse'];

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      type: 'Apartment',
      image: '',
      user: {
        name: '',
        email: '',
        phone: ''
      },
      imageFile: null
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('user.')) {
      const userField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [userField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newProperty: Property = {
      ...formData,
      id: editingProperty ? editingProperty.id : Date.now(),
      price: parseFloat(formData.price as unknown as string),
      bedrooms: parseInt(formData.bedrooms as unknown as string),
      bathrooms: parseInt(formData.bathrooms as unknown as string),
      area: parseInt(formData.area as unknown as string),
      listedDate: editingProperty ? editingProperty.listedDate : new Date().toISOString().split('T')[0],
      image: formData.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"
    };

    if (editingProperty) {
      setProperties(prev => prev.map(prop => 
        prop.id === editingProperty.id ? newProperty : prop
      ));
      setEditingProperty(null);
    } else {
      setProperties(prev => [...prev, newProperty]);
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (property: Property) => {
    setFormData({
      ...property,
      price: property.price.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      imageFile: null
    });
    setEditingProperty(property);
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(prev => prev.filter(prop => prop.id !== id));
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProperty(null);
    resetForm();
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Listings</h1>
              <p className="text-gray-600">Admin Dashboard - Manage all property listings</p>
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
                      placeholder="Search properties..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                    />
                  </div>

                  {/* Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="All">All Types</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
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

            {/* Add/Edit Property Form */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingProperty ? 'Edit Property' : 'Add New Property'}
                    </h2>
                    <button
                      onClick={handleCancel}
                      className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Property Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {propertyTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                          <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                          <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft)</label>
                          <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {editingProperty ? 'Change Property Image' : 'Upload Property Image'}
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Camera className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          {formData.image && (
                            <div className="w-32 h-32 relative">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: '', imageFile: null }))}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                              >
                                <X className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Owner Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="user.name"
                          value={formData.user.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          name="user.email"
                          value={formData.user.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="user.phone"
                          value={formData.user.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingProperty ? 'Update Property' : 'Add Property'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Properties List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Properties ({properties.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {properties.map((property) => (
                  <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full lg:w-48 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Property Details */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                            <p className="text-2xl font-bold text-blue-600">${property.price.toLocaleString()}</p>
                            
                            <div className="flex items-center text-gray-600 gap-1">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{property.location}</span>
                            </div>

                            <div className="flex gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4" />
                                <span>{property.bedrooms} bed</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{property.bathrooms} bath</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Square className="w-4 h-4" />
                                <span>{property.area} sq ft</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {property.type}
                              </span>
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Listed: {new Date(property.listedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* User Info & Actions */}
                          <div className="lg:text-right space-y-3">
                            <div className="bg-gray-100 p-4 rounded-lg space-y-2 lg:min-w-[250px]">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">{property.user.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{property.user.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{property.user.phone}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEdit(property)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Property"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(property.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete Property"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {properties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No properties listed yet.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add the first property
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;