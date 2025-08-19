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
} from "lucide-react";
import HouseService from "../../services/House_Service";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisteredHouse {
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

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [houses, setHouses] = useState<RegisteredHouse[]>([]);
  const [loadingHouses, setLoadingHouses] = useState(false);
  const [housesError, setHousesError] = useState<string | null>(null);

  // Fetch houses when user changes or houses tab is opened
  useEffect(() => {
    if (user && activeTab === "houses") {
      fetchUserHouses();
    }
  }, [user, activeTab]);

  const fetchUserHouses = async () => {
    if (!user) return;

    setLoadingHouses(true);
    setHousesError(null);

    try {
      console.log("Fetching houses for user:", user._id);
      const response = await HouseService.getHousesByUserId(user._id);

      let housesData: RegisteredHouse[] = [];
      if (response.houses) {
        housesData = response.houses;
      } else if (response.data) {
        housesData = response.data;
      } else if (Array.isArray(response)) {
        housesData = response;
      }

      setHouses(housesData);
    } catch (error) {
      console.error("Error fetching houses:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setHousesError(`Failed to load houses: ${errorMessage}`);
    } finally {
      setLoadingHouses(false);
    }
  };

  if (!isOpen || !user) return null;

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
        return <Home className="w-5 h-5" />;
      case "Apartment":
      case "Condominium":
      case "Studio":
        return <Building className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-purple-100 text-lg mb-3">Platform User</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-purple-100">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Joined {formatDate(user.createdAt)}
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
              { id: "personal", label: "Personal Info", icon: User },
              { id: "houses", label: "Registered Houses", icon: Home },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
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
          {activeTab === "personal" && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <p className="font-semibold text-slate-800">
                        {user.contactNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-semibold text-slate-800">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:col-span-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Address</p>
                      <p className="font-semibold text-slate-800">
                        {user.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">
                      Account Created
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">Last Updated</span>
                    <span className="font-semibold text-slate-800">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-600">User ID</span>
                    <span className="font-mono text-sm text-slate-800">
                      {user._id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="p-3 bg-purple-50 rounded-2xl w-fit mx-auto mb-3">
                    <Home className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 mb-1">
                    {houses.length}
                  </div>
                  <div className="text-sm text-slate-600">
                    Registered Houses
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="p-3 bg-green-50 rounded-2xl w-fit mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 mb-1">
                    {houses.filter((h) => h.status === "Approved").length}
                  </div>
                  <div className="text-sm text-slate-600">Approved Houses</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="p-3 bg-yellow-50 rounded-2xl w-fit mx-auto mb-3">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-800 mb-1">
                    {houses.filter((h) => h.status === "Pending").length}
                  </div>
                  <div className="text-sm text-slate-600">Pending Houses</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "houses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                  <Home className="w-5 h-5 text-purple-500" />
                  <span>Registered Houses</span>
                </h3>
                <button
                  onClick={fetchUserHouses}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  Refresh
                </button>
              </div>

              {loadingHouses && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading houses...</p>
                </div>
              )}

              {housesError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{housesError}</p>
                  </div>
                </div>
              )}

              {!loadingHouses && !housesError && houses.length === 0 && (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No houses registered yet</p>
                  <p className="text-sm text-slate-500 mt-2">
                    User ID: {user._id}
                  </p>
                </div>
              )}

              {!loadingHouses && houses.length > 0 && (
                <div className="space-y-4">
                  {houses.map((house) => (
                    <div
                      key={house._id}
                      className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            {getPropertyTypeIcon(house.propertyType)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">
                              {house.propertyType}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {house.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Bed className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Bedrooms</p>
                            <p className="font-semibold text-slate-800">
                              {house.bedrooms || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-cyan-100 rounded-lg">
                            <Bath className="w-4 h-4 text-cyan-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Bathrooms</p>
                            <p className="font-semibold text-slate-800">
                              {house.bathrooms || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Square className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Area</p>
                            <p className="font-semibold text-slate-800">
                              {house.area ? `${house.area} sq ft` : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Built</p>
                            <p className="font-semibold text-slate-800">
                              {house.yearBuilt || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Owner Information */}
                      <div className="bg-slate-50 rounded-lg p-4 mb-4">
                        <h5 className="font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Owner Information</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-slate-600">Name</p>
                            <p className="font-medium text-slate-800">
                              {house.ownerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600">Phone</p>
                            <p className="font-medium text-slate-800">
                              {house.ownerPhone}
                            </p>
                          </div>
                          {house.ownerEmail && (
                            <div>
                              <p className="text-slate-600">Email</p>
                              <p className="font-medium text-slate-800">
                                {house.ownerEmail}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {house.description && (
                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                          <div className="flex items-start space-x-2">
                            <FileText className="w-4 h-4 text-slate-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">
                                Description
                              </p>
                              <p className="text-sm text-slate-600">
                                {house.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Amenities */}
                      {house.amenities && house.amenities.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Amenities</span>
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {house.amenities.map((amenity, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Photos */}
                      {house.photos && house.photos.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                            <Image className="w-4 h-4" />
                            <span>Photos ({house.photos.length})</span>
                          </h5>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {house.photos.map((photo, index) => (
                              <div
                                key={index}
                                className="relative bg-slate-100 rounded-lg overflow-hidden aspect-square"
                              >
                                <img
                                  src={photo.url}
                                  alt={photo.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const imgElement =
                                      e.target as HTMLImageElement;
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
                                  <Image className="w-6 h-6 text-slate-400" />
                                </div>
                                <div
                                  className="absolute inset-0 flex items-center justify-center bg-slate-200"
                                  style={{ display: "none" }}
                                >
                                  <Image className="w-6 h-6 text-slate-400" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Registration Date */}
                      <div className="text-xs text-slate-500 border-t pt-3">
                        Registered on {formatDate(house.createdAt)} • Last
                        updated {formatDate(house.updatedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              User since {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
