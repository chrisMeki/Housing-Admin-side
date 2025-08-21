import React from "react";
import {
  X,
  MapPin,
  Bed,
  Bath,
  Square,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  Calendar,
  Home,
  Building,
  DollarSign,
  Tag,
} from "lucide-react";

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  image: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  listedDate: string;
}

interface PropertyViewModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
}

const PropertyViewModal: React.FC<PropertyViewModalProps> = ({
  property,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !property) return null;

  const handleEdit = () => {
    onEdit(property);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(property.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getPropertyIcon = (propertyType: string) => {
    switch (propertyType) {
      case "Single Family Home":
      case "House":
      case "Villa":
        return <Home className="w-6 h-6" />;
      case "Apartment":
      case "Condominium":
      case "Studio":
        return <Building className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                {getPropertyIcon(property.propertyType)}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-blue-100 text-lg mb-3">
                ${property.price.toLocaleString()}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-blue-100">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-100">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Listed {formatDate(property.listedDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Property Image */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Tag className="w-5 h-5 text-blue-500" />
                <span>Property Gallery</span>
              </h3>
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-80 object-cover rounded-2xl shadow-md"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-800 text-sm font-medium rounded-full shadow-lg">
                    {property.propertyType}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Home className="w-5 h-5 text-blue-500" />
                <span>Property Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Bed className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Bedrooms</p>
                    <p className="font-bold text-slate-800">
                      {property.bedrooms}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-cyan-100 rounded-xl">
                    <Bath className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Bathrooms</p>
                    <p className="font-bold text-slate-800">
                      {property.bathrooms}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Square className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Area</p>
                    <p className="font-bold text-slate-800">
                      {property.area} sq ft
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Pricing Information</span>
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Listed Price</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${property.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Price per sq ft</p>
                  <p className="text-xl font-semibold text-slate-800">
                    $
                    {Math.round(
                      property.price / property.area
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-500" />
                <span>Owner Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Owner Name</p>
                    <p className="font-bold text-slate-800">
                      {property.ownerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Phone</p>
                    <p className="font-bold text-slate-800">
                      {property.ownerPhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-bold text-slate-800">
                      {property.ownerEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Features Grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Property Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-bold text-blue-800 text-lg">
                    {property.bedrooms}
                  </p>
                  <p className="text-sm text-blue-600">Bedrooms</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-xl text-center border border-cyan-100">
                  <Bath className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <p className="font-bold text-cyan-800 text-lg">
                    {property.bathrooms}
                  </p>
                  <p className="text-sm text-cyan-600">Bathrooms</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                  <Square className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-800 text-lg">
                    {property.area}
                  </p>
                  <p className="text-sm text-green-600">sq ft</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                  <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="font-bold text-orange-800 text-sm">
                    {property.propertyType}
                  </p>
                  <p className="text-sm text-orange-600">Property Type</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex gap-4">
                <button
                  onClick={handleEdit}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Edit className="w-5 h-5" />
                  Edit Property
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Property ID: #{property.id} • Listed on{" "}
              {formatDate(property.listedDate)}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyViewModal;
