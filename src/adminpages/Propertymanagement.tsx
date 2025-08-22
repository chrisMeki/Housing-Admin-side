import React, { useState, ChangeEvent } from "react";
import {
  Search,
  Plus,
  MapPin,
  Home,
  Edit,
  Trash2,
  Eye,
  Filter,
  Camera,
  X,
  Menu,
  Bell,
} from "lucide-react";
import Sidebar from "../components/sidebar";

type PropertyType =
  | "Single Family Home"
  | "Apartment"
  | "Condominium"
  | "Townhouse"
  | "Duplex"
  | "Studio"
  | "Commercial"
  | "Land";
type PropertyStatus = "Pending" | "Approved" | "Rejected" | "Needs Documents";

interface Photo {
  name: string;
  url: string;
}

interface Property {
  id: number;
  userId?: string;
  propertyType: PropertyType;
  address: string;
  lat?: string;
  lng?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // square feet
  yearBuilt?: number;
  description?: string;
  amenities: string[];
  photos: Photo[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

interface NewProperty {
  propertyType: PropertyType;
  address: string;
  lat?: string;
  lng?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number;
  description?: string;
  amenities: string[];
  photos: Photo[];
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}



const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      propertyType: "Single Family Home",
      address: "123 Main Street, Downtown, Harare",
      lat: "-17.8252",
      lng: "31.0335",
      ownerName: "John Smith",
      ownerPhone: "+263771234567",
      ownerEmail: "john.smith@email.com",
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      yearBuilt: 2010,
      description: "Beautiful family home with garden",
      amenities: ["Garden", "Garage", "Security", "Borehole"],
      photos: [
        {
          name: "front-view.jpg",
          url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop",
        },
      ],
      status: "Approved",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:20:00Z",
    },
    {
      id: 2,
      propertyType: "Commercial",
      address: "456 Oak Avenue, Suburb, Harare",
      lat: "-17.8292",
      lng: "31.0375",
      ownerName: "ABC Corp Ltd",
      ownerPhone: "+263774567890",
      ownerEmail: "contact@abccorp.co.zw",
      bedrooms: 0,
      bathrooms: 3,
      area: 3000,
      yearBuilt: 2018,
      description: "Modern commercial space suitable for offices",
      amenities: ["Parking", "Air Conditioning", "Security", "Elevator"],
      photos: [
        {
          name: "building-exterior.jpg",
          url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
        },
      ],
      status: "Pending",
      createdAt: "2024-02-20T09:15:00Z",
      updatedAt: "2024-02-20T09:15:00Z",
    },
    {
      id: 3,
      propertyType: "Apartment",
      address: "789 Pine Road, Avondale, Harare",
      lat: "-17.8312",
      lng: "31.0395",
      ownerName: "Mary Johnson",
      ownerPhone: "+263778901234",
      ownerEmail: "mary.johnson@gmail.com",
      bedrooms: 2,
      bathrooms: 1,
      area: 800,
      yearBuilt: 2015,
      description: "Cozy apartment in quiet neighborhood",
      amenities: ["Balcony", "Built-in Cupboards", "Prepaid Electricity"],
      photos: [
        {
          name: "apartment-view.jpg",
          url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop",
        },
      ],
      status: "Needs Documents",
      createdAt: "2024-01-10T16:45:00Z",
      updatedAt: "2024-01-12T11:30:00Z",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [newAmenity, setNewAmenity] = useState<string>("");

  const [newProperty, setNewProperty] = useState<NewProperty>({
    propertyType: "Single Family Home",
    address: "",
    lat: "",
    lng: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    yearBuilt: undefined,
    description: "",
    amenities: [],
    photos: [],
  });

  const propertyTypes: PropertyType[] = [
    "Single Family Home",
    "Apartment",
    "Condominium",
    "Townhouse",
    "Duplex",
    "Studio",
    "Commercial",
    "Land",
  ];

  const commonAmenities = [
    "Garden",
    "Garage",
    "Security",
    "Borehole",
    "Swimming Pool",
    "Air Conditioning",
    "Balcony",
    "Built-in Cupboards",
    "Prepaid Electricity",
    "Parking",
    "Elevator",
    "Generator",
  ];

  const handleAddProperty = () => {
    if (
      !newProperty.address ||
      !newProperty.ownerName ||
      !newProperty.ownerPhone
    )
      return;

    const property: Property = {
      id: Date.now(),
      ...newProperty,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProperties([...properties, property]);
    setNewProperty({
      propertyType: "Single Family Home",
      address: "",
      lat: "",
      lng: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      yearBuilt: undefined,
      description: "",
      amenities: [],
      photos: [],
    });
    setShowAddForm(false);
  };

  const handleDeleteProperty = (id: number) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setNewProperty({
      ...newProperty,
      photos: [...newProperty.photos, ...newPhotos],
    });
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = newProperty.photos.filter((_, i) => i !== index);
    setNewProperty({
      ...newProperty,
      photos: updatedPhotos,
    });
  };

  const addAmenity = () => {
    if (
      newAmenity.trim() &&
      !newProperty.amenities.includes(newAmenity.trim())
    ) {
      setNewProperty({
        ...newProperty,
        amenities: [...newProperty.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setNewProperty({
      ...newProperty,
      amenities: newProperty.amenities.filter((a) => a !== amenity),
    });
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Needs Documents":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-64"
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            Property Management
          </h1>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Property Management System
              </h1>
              <p className="text-gray-600">Housing Registration Portal</p>
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
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Needs Documents">Needs Documents</option>
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
                    <p className="text-2xl font-semibold text-gray-900">
                      {properties.length}
                    </p>
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
                    <p className="text-2xl font-semibold text-gray-900">
                      {properties.filter((p) => p.status === "Approved").length}
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
                      {properties.filter((p) => p.status === "Pending").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Search className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Needs Documents</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {
                        properties.filter((p) => p.status === "Needs Documents")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Property Listings
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {property.photos && property.photos.length > 0 && (
                              <img
                                src={property.photos[0].url}
                                alt={property.photos[0].name}
                                className="w-12 h-12 rounded-lg object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {property.address}
                              </div>
                              <div className="text-sm text-gray-500">
                                {property.bedrooms > 0 &&
                                  `${property.bedrooms}BR, `}
                                {property.bathrooms}BA • {property.area} sqft
                                {property.yearBuilt &&
                                  ` • Built ${property.yearBuilt}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.ownerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.ownerPhone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {property.propertyType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              property.status
                            )}`}
                          >
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </td>
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
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Add New Property
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Property Type
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.propertyType}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              propertyType: e.target.value as PropertyType,
                            })
                          }
                        >
                          {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Year Built
                        </label>
                        <input
                          type="number"
                          min="1800"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.yearBuilt || ""}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              yearBuilt: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProperty.address}
                        onChange={(e) =>
                          setNewProperty({
                            ...newProperty,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude
                        </label>
                        <input
                          type="text"
                          placeholder="-17.8252"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.lat || ""}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              lat: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude
                        </label>
                        <input
                          type="text"
                          placeholder="31.0335"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.lng || ""}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              lng: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Owner Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.ownerName}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              ownerName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Owner Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+263771234567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.ownerPhone}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              ownerPhone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProperty.ownerEmail || ""}
                        onChange={(e) =>
                          setNewProperty({
                            ...newProperty,
                            ownerEmail: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.bedrooms}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              bedrooms: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.bathrooms}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              bathrooms: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Area (sqft)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newProperty.area}
                          onChange={(e) =>
                            setNewProperty({
                              ...newProperty,
                              area: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newProperty.description || ""}
                        onChange={(e) =>
                          setNewProperty({
                            ...newProperty,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Amenities Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amenities
                      </label>

                      {/* Selected Amenities */}
                      {newProperty.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {newProperty.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {amenity}
                              <button
                                onClick={() => removeAmenity(amenity)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Add Amenity Input */}
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Add amenity..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={newAmenity}
                          onChange={(e) => setNewAmenity(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addAmenity()}
                        />
                        <button
                          type="button"
                          onClick={addAmenity}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>

                      {/* Common Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {commonAmenities.map(
                          (amenity) =>
                            !newProperty.amenities.includes(amenity) && (
                              <button
                                key={amenity}
                                type="button"
                                onClick={() =>
                                  setNewProperty({
                                    ...newProperty,
                                    amenities: [
                                      ...newProperty.amenities,
                                      amenity,
                                    ],
                                  })
                                }
                                className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
                              >
                                + {amenity}
                              </button>
                            )
                        )}
                      </div>
                    </div>

                    {/* Photos Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Photos
                      </label>

                      {/* Photo Preview Grid */}
                      {newProperty.photos.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {newProperty.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                {photo.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Button */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          id="photo-upload"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload photos
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            JPG, PNG up to 10MB each
                          </span>
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
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Property Details
                  </h3>

                  {/* Photos Section */}
                  {selectedProperty.photos &&
                    selectedProperty.photos.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-3">
                          Property Photos
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedProperty.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                {photo.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Basic Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">
                            Property Type:{" "}
                          </span>
                          <span className="text-gray-900">
                            {selectedProperty.propertyType}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Address:{" "}
                          </span>
                          <span className="text-gray-900">
                            {selectedProperty.address}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Status:{" "}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-sm ${getStatusColor(
                              selectedProperty.status
                            )}`}
                          >
                            {selectedProperty.status}
                          </span>
                        </div>
                        {selectedProperty.description && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Description:{" "}
                            </span>
                            <p className="text-gray-900 mt-1">
                              {selectedProperty.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Owner Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">
                            Owner Name:{" "}
                          </span>
                          <span className="text-gray-900">
                            {selectedProperty.ownerName}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Phone:{" "}
                          </span>
                          <span className="text-gray-900">
                            {selectedProperty.ownerPhone}
                          </span>
                        </div>
                        {selectedProperty.ownerEmail && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Email:{" "}
                            </span>
                            <span className="text-gray-900">
                              {selectedProperty.ownerEmail}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Property Details
                      </h4>
                      <div className="space-y-3">
                        {selectedProperty.bedrooms > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Bedrooms:{" "}
                            </span>
                            <span className="text-gray-900">
                              {selectedProperty.bedrooms}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">
                            Bathrooms:{" "}
                          </span>
                          <span className="text-gray-900">
                            {selectedProperty.bathrooms}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Area:{" "}
                          </span>
                          <span className="text-gray-900">
                            {selectedProperty.area} sqft
                          </span>
                        </div>
                        {selectedProperty.yearBuilt && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Year Built:{" "}
                            </span>
                            <span className="text-gray-900">
                              {selectedProperty.yearBuilt}
                            </span>
                          </div>
                        )}
                        {selectedProperty.lat && selectedProperty.lng && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Coordinates:{" "}
                            </span>
                            <span className="text-gray-900">
                              {selectedProperty.lat}, {selectedProperty.lng}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Registration Info
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">
                            Registration Date:{" "}
                          </span>
                          <span className="text-gray-900">
                            {new Date(
                              selectedProperty.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Last Updated:{" "}
                          </span>
                          <span className="text-gray-900">
                            {new Date(
                              selectedProperty.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Section */}
                  {selectedProperty.amenities &&
                    selectedProperty.amenities.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Amenities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
