import React, { useState } from "react";
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
  Info,
} from "lucide-react";

type PropertyStatus = "Pending" | "Approved" | "Rejected" | "Needs Documents";

interface Photo {
  name: string;
  url: string;
}

interface Property {
  id: number;
  userId?: string;
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
  photos: Photo[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !property) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString;
    }
  };

  const getStatusColor = (status: PropertyStatus) => {
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

  const getStatusIcon = (status: PropertyStatus) => {
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
        return <Home className="w-6 h-6" />;
      case "Apartment":
      case "Condominium":
      case "Studio":
        return <Building className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  const getPropertyInitials = (propertyType: string) => {
    const words = propertyType.split(" ");
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return propertyType.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                {property.photos && property.photos.length > 0 ? (
                  <img
                    src={property.photos[0].url}
                    alt="Property"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getPropertyInitials(property.propertyType)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {property.propertyType}
              </h1>
              <p className="text-blue-100 text-lg mb-3 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{property.address}</span>
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border bg-white/20 text-white border-white/30`}
                  >
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(property.status)}
                      <span>{property.status}</span>
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-blue-100">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Registered {formatDate(property.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: Info },
              { id: "details", label: "Property Details", icon: Home },
              { id: "photos", label: "Photos", icon: Image },
              { id: "owner", label: "Owner Info", icon: Users },
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="p-3 bg-blue-50 rounded-2xl w-fit mx-auto mb-3">
                    <Bed className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 mb-1">
                    {property.bedrooms || "N/A"}
                  </div>
                  <div className="text-sm text-slate-600">Bedrooms</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="p-3 bg-cyan-50 rounded-2xl w-fit mx-auto mb-3">
                    <Bath className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 mb-1">
                    {property.bathrooms || "N/A"}
                  </div>
                  <div className="text-sm text-slate-600">Bathrooms</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="p-3 bg-green-50 rounded-2xl w-fit mx-auto mb-3">
                    <Square className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 mb-1">
                    {property.area ? `${property.area}` : "N/A"}
                  </div>
                  <div className="text-sm text-slate-600">sq ft</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="p-3 bg-orange-50 rounded-2xl w-fit mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 mb-1">
                    {property.yearBuilt || "N/A"}
                  </div>
                  <div className="text-sm text-slate-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>Description</span>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span>Amenities</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {property.lat && property.lng && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-blue-500" />
                    <span>Location</span>
                  </h3>
                  <div className="space-y-2">
                    <p className="text-slate-700">{property.address}</p>
                    <p className="text-sm text-slate-500">
                      Coordinates: {property.lat}, {property.lng}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Information */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Home className="w-5 h-5 text-blue-500" />
                    <span>Property Information</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Property Type</span>
                      <span className="font-semibold text-slate-800">
                        {property.propertyType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Bedrooms</span>
                      <span className="font-semibold text-slate-800">
                        {property.bedrooms || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Bathrooms</span>
                      <span className="font-semibold text-slate-800">
                        {property.bathrooms || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Area</span>
                      <span className="font-semibold text-slate-800">
                        {property.area ? `${property.area} sqft` : "N/A"}
                      </span>
                    </div>
                    {property.yearBuilt && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-600">Year Built</span>
                        <span className="font-semibold text-slate-800">
                          {property.yearBuilt}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Registration Details */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Registration Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          property.status
                        )}`}
                      >
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(property.status)}
                          <span>{property.status}</span>
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Registered</span>
                      <span className="font-semibold text-slate-800">
                        {formatDate(property.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Last Updated</span>
                      <span className="font-semibold text-slate-800">
                        {formatDate(property.updatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600">Property ID</span>
                      <span className="font-mono text-sm text-slate-800">
                        #{property.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="space-y-6">
              {property.photos && property.photos.length > 0 ? (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Image className="w-5 h-5 text-blue-500" />
                    <span>Property Photos ({property.photos.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {property.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative bg-slate-100 rounded-2xl overflow-hidden aspect-[4/3] hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop";
                          }}
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg">
                          {photo.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No photos available</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Photos will appear here once uploaded
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "owner" && (
            <div className="space-y-6">
              {/* Owner Information */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Owner Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Owner Name</p>
                      <p className="font-semibold text-slate-800">
                        {property.ownerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <p className="font-semibold text-slate-800">
                        {property.ownerPhone}
                      </p>
                    </div>
                  </div>
                  {property.ownerEmail && (
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="font-semibold text-slate-800">
                          {property.ownerEmail}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Call Owner</span>
                </button>
                {property.ownerEmail && (
                  <button className="flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl transition-colors">
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Send Email</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Property registered on {formatDate(property.createdAt)}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;