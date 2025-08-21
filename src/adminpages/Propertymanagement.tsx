import React, { useState, ChangeEvent, useEffect } from "react";
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
import PropertyDetailsModal from "../components/prop_management/view";
import EditPropertyModal from "../components/prop_management/edit";
import HouseService from "../services/House_Service";

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

const PropertyManagement = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [newAmenity, setNewAmenity] = useState<string>("");
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

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

  //fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await HouseService.getAllHouses();
        // Map backend data to your Property interface
        const mappedProperties =
          response.data?.map((house: any) => ({
            id: house._id || house.id,
            userId: house.userId,
            propertyType: house.propertyType || "Single Family Home",
            address: house.address || "",
            lat: house.lat || house.latitude,
            lng: house.lng || house.longitude,
            ownerName: house.ownerName || house.owner?.name || "",
            ownerPhone: house.ownerPhone || house.owner?.phone || "",
            ownerEmail: house.ownerEmail || house.owner?.email || "",
            bedrooms: house.bedrooms || 0,
            bathrooms: house.bathrooms || 0,
            area: house.area || house.squareFeet || 0,
            yearBuilt: house.yearBuilt,
            description: house.description || "",
            amenities: house.amenities || [],
            photos: house.photos || house.images || [],
            status: house.status || "Pending",
            createdAt: house.createdAt || new Date().toISOString(),
            updatedAt: house.updatedAt || new Date().toISOString(),
          })) || [];

        setProperties(mappedProperties);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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

  const handleAddProperty = async () => {
    if (
      !newProperty.address ||
      !newProperty.ownerName ||
      !newProperty.ownerPhone
    )
      return;

    try {
      setLoading(true);
      const response = await HouseService.createHouse(newProperty);

      // Add the new property to the list
      const createdProperty: Property = {
        id: response.data._id || response.data.id || Date.now(),
        ...newProperty,
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProperties([...properties, createdProperty]);

      // Reset form
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
      setError(null);
    } catch (err: any) {
      console.error("Error adding property:", err);
      setError(err.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    try {
      setLoading(true);
      await HouseService.deleteHouse(id.toString());
      setProperties(properties.filter((p) => p.id !== id));
      setError(null);
    } catch (err: any) {
      console.error("Error deleting property:", err);
      setError(err.message || "Failed to delete property");
    } finally {
      setLoading(false);
    }
  };

  //handle edit
  const handleEditProperty = async (property: Property) => {
    if (
      !property ||
      !property.address ||
      !property.ownerName ||
      !property.ownerPhone
    )
      return;

    try {
      setLoading(true);
      const updateData = {
        propertyType: property.propertyType,
        address: property.address,
        lat: property.lat,
        lng: property.lng,
        ownerName: property.ownerName,
        ownerPhone: property.ownerPhone,
        ownerEmail: property.ownerEmail,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        yearBuilt: property.yearBuilt,
        description: property.description,
        amenities: property.amenities,
        photos: property.photos,
      };

      await HouseService.updateHouse(property.id.toString(), updateData);

      // Update the property in the list
      setProperties(
        properties.map((p) => (p.id === property.id ? property : p))
      );

      setShowEditForm(false);
      setEditingProperty(null);
      setError(null);
    } catch (err: any) {
      console.error("Error updating property:", err);
      setError(err.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (property: Property) => {
    setEditingProperty(property);
    setShowEditForm(true);
  };

  const handleCloseEditModal = () => {
    setShowEditForm(false);
    setEditingProperty(null);
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

  const refreshProperties = async () => {
    try {
      setLoading(true);
      const response = await HouseService.getAllHouses();
      const mappedProperties =
        response.data?.map((house: any) => ({
          // ... same mapping as in useEffect
          id: house._id || house.id,
          userId: house.userId,
          propertyType: house.propertyType || "Single Family Home",
          address: house.address || "",
          lat: house.lat || house.latitude,
          lng: house.lng || house.longitude,
          ownerName: house.ownerName || house.owner?.name || "",
          ownerPhone: house.ownerPhone || house.owner?.phone || "",
          ownerEmail: house.ownerEmail || house.owner?.email || "",
          bedrooms: house.bedrooms || 0,
          bathrooms: house.bathrooms || 0,
          area: house.area || house.squareFeet || 0,
          yearBuilt: house.yearBuilt,
          description: house.description || "",
          amenities: house.amenities || [],
          photos: house.photos || house.images || [],
          status: house.status || "Pending",
          createdAt: house.createdAt || new Date().toISOString(),
          updatedAt: house.updatedAt || new Date().toISOString(),
        })) || [];
      setProperties(mappedProperties);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to refresh properties");
    } finally {
      setLoading(false);
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Needs Documents">Needs Documents</option>
                    </select>
                  </div>
                </div>

                {/* Add Property Button */}
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-red-600 text-sm">{error}</div>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="relative">
                    {property.photos.length > 0 ? (
                      <img
                        src={property.photos[0].url}
                        alt={property.address}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {property.propertyType}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedProperty(property)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(property)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs truncate">
                        {property.address}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <p className="font-medium">{property.ownerName}</p>
                      <p className="text-xs">{property.ownerPhone}</p>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </span>
                      <span>{property.area} sqft</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Properties Found */}
            {filteredProperties.length === 0 && !loading && (
              <div className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterStatus !== "All"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first property"}
                </p>
                {!searchTerm && filterStatus === "All" && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Property
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.address}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter property address"
                  />
                </div>

                {/* Coordinates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.lat}
                    onChange={(e) =>
                      setNewProperty({ ...newProperty, lat: e.target.value })
                    }
                    placeholder="Latitude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.lng}
                    onChange={(e) =>
                      setNewProperty({ ...newProperty, lng: e.target.value })
                    }
                    placeholder="Longitude"
                  />
                </div>

                {/* Owner Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.ownerName}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        ownerName: e.target.value,
                      })
                    }
                    placeholder="Owner name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Phone *
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.ownerPhone}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        ownerPhone: e.target.value,
                      })
                    }
                    placeholder="Owner phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.ownerEmail}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        ownerEmail: e.target.value,
                      })
                    }
                    placeholder="Owner email address"
                  />
                </div>

                {/* Property Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.bathrooms}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        bathrooms: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.area}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        area: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.yearBuilt || ""}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        yearBuilt: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newProperty.description}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        description: e.target.value,
                      })
                    }
                    placeholder="Property description..."
                  />
                </div>

                {/* Amenities */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add amenity"
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
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Common amenities:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {commonAmenities.map((amenity) => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => {
                            if (!newProperty.amenities.includes(amenity)) {
                              setNewProperty({
                                ...newProperty,
                                amenities: [...newProperty.amenities, amenity],
                              });
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            newProperty.amenities.includes(amenity)
                              ? "bg-blue-100 text-blue-800 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          disabled={newProperty.amenities.includes(amenity)}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Amenities */}
                  {newProperty.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newProperty.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photo Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload photos or drag and drop
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG, JPEG up to 10MB each
                      </span>
                    </label>
                  </div>

                  {/* Photo Preview */}
                  {newProperty.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newProperty.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProperty}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Property"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Edit Property Modal */}
      {/* Edit Property Modal */}
      {showEditForm && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          isOpen={showEditForm}
          onClose={handleCloseEditModal}
          onSave={handleEditProperty}
          loading={loading}
        />
      )}
    </div>
  );
};

export default PropertyManagement;
