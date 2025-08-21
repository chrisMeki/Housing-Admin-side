import { useState, useEffect } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Home,
  Building,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Bed,
  Bath,
  Square,
  Star,
  Image,
  MapPinIcon,
  Users,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";

 export interface HouseData {
  _id: string;
  userId: string;
  propertyType: string;
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
  photos: Array<{
    name: string;
    url: string;
  }>;
  status: "Pending" | "Approved" | "Rejected" | "Needs Documents";
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
}

interface HouseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: HouseData | null;
  onStatusUpdate?: (houseId: string, newStatus: string) => void;
  onEdit?: (house: HouseData) => void;
  onDelete?: (houseId: string) => void;
}

const HouseDetailsModal = ({
  isOpen,
  onClose,
  house,
  onStatusUpdate,
  onEdit,
  onDelete,
}: HouseDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [ownerData, setOwnerData] = useState<UserData | null>(null);
  const [loadingOwner, setLoadingOwner] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && house) {
      setActiveTab("details");
      setSelectedPhoto(null);
      // You can fetch owner data here if needed
      // fetchOwnerData(house.userId);
    }
  }, [isOpen, house]);

  if (!isOpen || !house) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Needs Documents":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Needs Documents":
        return <FileText className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPropertyTypeIcon = (propertyType: string) => {
    switch (propertyType) {
      case "Single Family Home":
      case "Duplex":
      case "Townhouse":
        return <Home className="w-6 h-6" />;
      case "Apartment":
      case "Condominium":
      case "Studio":
        return <Building className="w-6 h-6" />;
      case "Commercial":
        return <Building className="w-6 h-6" />;
      case "Land":
        return <Square className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(house._id, newStatus);
    }
  };

  const openGoogleMaps = () => {
    if (house.lat && house.lng) {
      window.open(
        `https://maps.google.com/?q=${house.lat},${house.lng}`,
        "_blank"
      );
    } else {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(house.address)}`,
        "_blank"
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-white">
                    {getPropertyTypeIcon(house.propertyType)}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {house.propertyType}
                </h1>
                <p className="text-blue-100 text-lg mb-3 flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{house.address}</span>
                  <button
                    onClick={openGoogleMaps}
                    className="p-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                    title="View on Google Maps"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        house.status
                      )} bg-white/90`}
                    >
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(house.status)}
                        <span>{house.status}</span>
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-100">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Registered {formatDate(house.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(house)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200"
                  title="Edit House"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(house._id)}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-200"
                  title="Delete House"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 px-6">
            <div className="flex space-x-8">
              {[
                { id: "details", label: "Property Details", icon: Home },
                { id: "photos", label: "Photos", icon: Image },
                { id: "owner", label: "Owner Info", icon: Users },
                { id: "management", label: "Management", icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === "photos" && house.photos.length > 0 && (
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                        {house.photos.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Property Overview */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Home className="w-5 h-5 text-blue-500" />
                    <span>Property Overview</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Bed className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Bedrooms</p>
                        <p className="text-xl font-bold text-slate-800">
                          {house.bedrooms || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-cyan-100 rounded-xl">
                        <Bath className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Bathrooms</p>
                        <p className="text-xl font-bold text-slate-800">
                          {house.bathrooms || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Square className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Area</p>
                        <p className="text-xl font-bold text-slate-800">
                          {house.area
                            ? `${house.area.toLocaleString()} sq ft`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Year Built</p>
                        <p className="text-xl font-bold text-slate-800">
                          {house.yearBuilt || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <span>Location</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Address</p>
                        <p className="font-semibold text-slate-800">
                          {house.address}
                        </p>
                      </div>
                      <button
                        onClick={openGoogleMaps}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        <span>View on Map</span>
                      </button>
                    </div>
                    {house.lat && house.lng && (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">
                            Latitude
                          </p>
                          <p className="font-mono text-sm text-slate-800">
                            {house.lat}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 mb-1">
                            Longitude
                          </p>
                          <p className="font-mono text-sm text-slate-800">
                            {house.lng}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {house.description && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span>Description</span>
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {house.description}
                    </p>
                  </div>
                )}

                {/* Amenities */}
                {house.amenities && house.amenities.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Amenities</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {house.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "photos" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <Image className="w-5 h-5 text-purple-500" />
                    <span>Property Photos</span>
                    <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">
                      {house.photos.length} photos
                    </span>
                  </h3>
                </div>

                {house.photos.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">
                      No photos available
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Photos will appear here once uploaded
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {house.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative bg-slate-100 rounded-xl overflow-hidden aspect-video cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedPhoto(index)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement;
                            const fallbackElement =
                              imgElement.nextSibling as HTMLElement;
                            imgElement.style.display = "none";
                            if (fallbackElement) {
                              fallbackElement.style.display = "flex";
                            }
                          }}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-slate-200"
                          style={{ display: "none" }}
                        >
                          <Image className="w-8 h-8 text-slate-400" />
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium bg-black/50 rounded px-2 py-1 truncate">
                            {photo.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "owner" && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span>Owner Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Full Name</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {house.ownerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Phone Number</p>
                        <p className="text-lg font-semibold text-slate-800">
                          <a
                            href={`tel:${house.ownerPhone}`}
                            className="hover:text-green-600 transition-colors"
                          >
                            {house.ownerPhone}
                          </a>
                        </p>
                      </div>
                    </div>
                    {house.ownerEmail && (
                      <div className="flex items-center space-x-3 md:col-span-2">
                        <div className="p-3 bg-purple-100 rounded-xl">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">
                            Email Address
                          </p>
                          <p className="text-lg font-semibold text-slate-800">
                            <a
                              href={`mailto:${house.ownerEmail}`}
                              className="hover:text-purple-600 transition-colors"
                            >
                              {house.ownerEmail}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h4 className="font-semibold text-slate-800 mb-4">
                    Quick Actions
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${house.ownerPhone}`}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Owner</span>
                    </a>
                    {house.ownerEmail && (
                      <a
                        href={`mailto:${house.ownerEmail}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email Owner</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "management" && (
              <div className="space-y-6">
                {/* Status Management */}
                {onStatusUpdate && (
                  <div className="bg-slate-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span>Status Management</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-600">
                          Current Status:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            house.status
                          )}`}
                        >
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(house.status)}
                            <span>{house.status}</span>
                          </span>
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Update Status:
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            "Pending",
                            "Approved",
                            "Rejected",
                            "Needs Documents",
                          ].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                house.status === status
                                  ? getStatusColor(status) + " border-current"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-1">
                                {getStatusIcon(status)}
                                <span className="text-xs font-medium">
                                  {status}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Property Information */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Property Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">
                        Property ID
                      </span>
                      <span className="font-mono text-sm text-slate-800">
                        {house._id}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">User ID</span>
                      <span className="font-mono text-sm text-slate-800">
                        {house.userId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">
                        Registration Date
                      </span>
                      <span className="font-semibold text-slate-800">
                        {formatDate(house.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">
                        Last Updated
                      </span>
                      <span className="font-semibold text-slate-800">
                        {formatDate(house.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Registered on {formatDate(house.createdAt)} • Last updated{" "}
                {formatDate(house.updatedAt)}
              </div>
              <div className="text-sm text-slate-500">
                Property ID: {house._id}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto !== null && house.photos[selectedPhoto] && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={house.photos[selectedPhoto].url}
              alt={house.photos[selectedPhoto].name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-lg font-medium bg-black/50 rounded-lg px-4 py-2 mx-auto inline-block">
                {house.photos[selectedPhoto].name}
              </p>
              <p className="text-white/70 text-sm mt-2">
                {selectedPhoto + 1} of {house.photos.length}
              </p>
            </div>

            {/* Navigation arrows */}
            {house.photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedPhoto(
                      selectedPhoto < house.photos.length - 1
                        ? selectedPhoto + 1
                        : 0
                    )
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white"
                >
                  <span className="sr-only">Next image</span>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HouseDetailsModal;
