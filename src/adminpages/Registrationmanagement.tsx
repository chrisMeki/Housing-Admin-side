import React, { useState, useEffect } from "react";
import {
  MapPin,
  Home,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Plus,
  Search,
  Eye,
  Edit,
  Filter,
  Menu,
  Bell,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/sidebar";
import PropertyRegistrationModal from "../components/house_registration/register_house";
import HouseService from "../services/House_Service";
import HouseDetailsModal from "../components/house_registration/view_registered";

interface Photo {
  name: string;
  url: string;
}

interface Registration {
  id: string;
  userId: string;
  propertyType: string;
  address: string;
  lat: string;
  lng: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerContactNumber: string;
  ownerAddress: string;
  description: string;
  amenities: string[];
  photos: Photo[];
  status: "Pending" | "Approved" | "Rejected" | "Needs Documents";
  createdAt: string;
  submittedBy: string;
}

export default function HousingRegistrationAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Pending" | "Approved" | "Rejected" | "Needs Documents"
  >("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);

  const handleViewDetails = (hosu: Registration) => {
    setSelectedUser(hosu);
    setShowDetailsModal(true);
  };

  // Fetch all houses from the backend
  const fetchHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await HouseService.getAllHouses();

      // Transform backend data to match your Registration interface
      const transformedData: Registration[] =
        response.data?.map((house: any) => ({
          id: house._id || house.id,
          userId: house.userId || house.owner?._id || "",
          propertyType: house.propertyType || "Single Family Home",
          address: house.address || "",
          lat: house.coordinates?.lat || house.lat || "",
          lng: house.coordinates?.lng || house.lng || "",
          area: house.area || house.squareFootage || 0,
          bedrooms: house.bedrooms || 0,
          bathrooms: house.bathrooms || 0,
          yearBuilt: house.yearBuilt || new Date().getFullYear(),
          ownerFirstName: house.owner?.firstName || house.ownerFirstName || "",
          ownerLastName: house.owner?.lastName || house.ownerLastName || "",
          ownerEmail: house.owner?.email || house.ownerEmail || "",
          ownerContactNumber:
            house.owner?.phone || house.ownerContactNumber || "",
          ownerAddress: house.owner?.address || house.ownerAddress || "",
          description: house.description || "",
          amenities: house.amenities || [],
          photos: house.photos || [],
          status: house.status || "Pending",
          createdAt: house.createdAt || new Date().toISOString(),
          submittedBy: house.submittedBy || "System",
        })) || [];

      setRegistrations(transformedData);
    } catch (err: any) {
      console.error("Error fetching houses:", err);
      setError(err?.message || "Failed to fetch properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchHouses();
  }, []);

  const handleNewPropertySubmit = async (newRegistration: Registration) => {
    try {
      // Transform the registration data to match your backend expected format
      const houseData = {
        propertyType: newRegistration.propertyType,
        address: newRegistration.address,
        coordinates: {
          lat: newRegistration.lat,
          lng: newRegistration.lng,
        },
        area: newRegistration.area,
        bedrooms: newRegistration.bedrooms,
        bathrooms: newRegistration.bathrooms,
        yearBuilt: newRegistration.yearBuilt,
        owner: {
          firstName: newRegistration.ownerFirstName,
          lastName: newRegistration.ownerLastName,
          email: newRegistration.ownerEmail,
          phone: newRegistration.ownerContactNumber,
          address: newRegistration.ownerAddress,
        },
        description: newRegistration.description,
        amenities: newRegistration.amenities,
        photos: newRegistration.photos,
        status: "Pending",
      };

      await HouseService.createHouse(houseData);

      // Refresh the data after successful creation
      await fetchHouses();

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error creating house:", err);
      setError(err?.message || "Failed to create property. Please try again.");
    }
  };

  const updateRegistrationStatus = async (
    id: string,
    newStatus: "Pending" | "Approved" | "Rejected" | "Needs Documents"
  ) => {
    try {
      await HouseService.updateHouse(id, { status: newStatus });

      // Update local state
      setRegistrations((prev) =>
        prev.map((reg) => (reg.id === id ? { ...reg, status: newStatus } : reg))
      );
    } catch (err: any) {
      console.error("Error updating house status:", err);
      setError(
        err?.message || "Failed to update property status. Please try again."
      );
    }
  };

  const getStatusColor = (status: string) => {
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

  const filteredRegistrations = registrations.filter((reg) => {
    const ownerName = `${reg.ownerFirstName} ${reg.ownerLastName}`;
    const matchesSearch =
      ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: registrations.length,
    Pending: registrations.filter((r) => r.status === "Pending").length,
    Approved: registrations.filter((r) => r.status === "Approved").length,
    Rejected: registrations.filter((r) => r.status === "Rejected").length,
    "Needs Documents": registrations.filter(
      (r) => r.status === "Needs Documents"
    ).length,
  };

  // Error component
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`flex-1 transition-all duration-300 lg:ml-[17rem]`}>
          <div className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  Error Loading Properties
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchHouses}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-[17rem]" : "lg:ml-[17rem]"
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
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Property Registration System
                  </h1>
                  <p className="text-gray-600">Housing Registration Portal</p>
                </div>
                {loading && (
                  <div className="flex items-center text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span className="text-sm">Loading properties...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Properties
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : statusCounts.all}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {loading ? "..." : statusCounts.Pending}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {loading ? "..." : statusCounts.Approved}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Need Review
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {loading
                        ? "..."
                        : statusCounts["Needs Documents"] +
                          statusCounts.Rejected}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Eye className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      disabled={loading}
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Needs Documents">Needs Documents</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchHouses}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Refresh"
                    )}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4" />
                    Register Property
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Property Registrations (
                  {loading ? "..." : filteredRegistrations.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">
                      Loading properties...
                    </span>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Owner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRegistrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <Home className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {registration.id}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {registration.propertyType}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {registration.ownerFirstName}{" "}
                                {registration.ownerLastName}
                              </div>
                              {registration.ownerEmail && (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {registration.ownerEmail}
                                </div>
                              )}
                              {registration.ownerContactNumber && (
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {registration.ownerContactNumber}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {registration.address && (
                                <div className="flex items-center mb-1">
                                  <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                                  <span className="truncate max-w-xs">
                                    {registration.address}
                                  </span>
                                </div>
                              )}
                              <div className="text-xs text-gray-500">
                                {registration.area > 0 &&
                                  `${registration.area} sq ft`}
                                {registration.bedrooms > 0 &&
                                  ` • ${registration.bedrooms} bed`}
                                {registration.bathrooms > 0 &&
                                  ` • ${registration.bathrooms} bath`}
                              </div>
                              {registration.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {registration.amenities
                                    .slice(0, 2)
                                    .map((amenity, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                      >
                                        {amenity}
                                      </span>
                                    ))}
                                  {registration.amenities.length > 2 && (
                                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                      +{registration.amenities.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                registration.status
                              )}`}
                            >
                              {registration.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              {new Date(
                                registration.createdAt
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs">
                              by {registration.submittedBy}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  updateRegistrationStatus(
                                    registration.id,
                                    "Approved"
                                  )
                                }
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                title="Approve"
                                disabled={loading}
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  updateRegistrationStatus(
                                    registration.id,
                                    "Rejected"
                                  )
                                }
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Reject"
                                disabled={loading}
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  updateRegistrationStatus(
                                    registration.id,
                                    "Needs Documents"
                                  )
                                }
                                className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                                title="Need Documents"
                                disabled={loading}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="View Details"
                                disabled={loading}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {!loading && filteredRegistrations.length === 0 && (
                <div className="text-center py-12">
                  <Home className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No properties found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {registrations.length === 0
                      ? "No properties have been registered yet."
                      : "No properties match your current search criteria."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Registration Modal */}
      <PropertyRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewPropertySubmit}
        registrationsLength={registrations.length}
      />
    </div>
  );
}
