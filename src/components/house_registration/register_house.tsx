import React, { useState } from "react";
import {
  MapPin,
  Home,
  User,
  Camera,
  FileText,
  Plus,
  X,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import HouseService from "../../services/House_Service";

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

interface FormData {
  userId: string;
  propertyType: string;
  address: string;
  lat: string;
  lng: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerContactNumber: string;
  ownerAddress: string;
  description: string;
  amenities: string[];
  photos: Photo[];
  status: "Pending" | "Approved" | "Rejected" | "Needs Documents";
}

interface PropertyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (registration: Registration) => void;
  registrationsLength: number;
}

const PropertyRegistrationModal: React.FC<PropertyRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  registrationsLength,
}) => {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    propertyType: "Single Family Home",
    address: "",
    lat: "",
    lng: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerContactNumber: "",
    ownerAddress: "",
    description: "",
    amenities: [],
    photos: [],
    status: "Pending",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const propertyTypeOptions = [
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
    "Security System",
    "Swimming Pool",
    "Gym Access",
    "Balcony",
    "Parking",
    "Air Conditioning",
    "Elevator",
    "Fireplace",
    "Walk-in Closet",
    "Laundry Room",
    "Basement",
    "Patio",
    "Deck",
  ];

  const resetForm = () => {
    setFormData({
      userId: "",
      propertyType: "Single Family Home",
      address: "",
      lat: "",
      lng: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      yearBuilt: "",
      ownerFirstName: "",
      ownerLastName: "",
      ownerEmail: "",
      ownerContactNumber: "",
      ownerAddress: "",
      description: "",
      amenities: [],
      photos: [],
      status: "Pending",
    });
    setNewAmenity("");
    setIsSubmitting(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    handleClose();
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const addPhoto = () => {
    const name = prompt("Enter photo name:");
    const url = prompt("Enter photo URL:");

    if (name && url) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, { name, url }],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      setErrorMessage("Property address is required");
      return false;
    }
    if (!formData.ownerFirstName.trim()) {
      setErrorMessage("Owner first name is required");
      return false;
    }
    if (!formData.ownerLastName.trim()) {
      setErrorMessage("Owner last name is required");
      return false;
    }
    if (!formData.ownerEmail.trim()) {
      setErrorMessage("Owner email is required");
      return false;
    }
    if (!formData.ownerContactNumber.trim()) {
      setErrorMessage("Owner contact number is required");
      return false;
    }
    if (!formData.ownerAddress.trim()) {
      setErrorMessage("Owner address is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowErrorPopup(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Prepare the house data for the API
      const houseData = {
        userId: formData.userId || "66c123456789abcd12345681",
        propertyType: formData.propertyType,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
        area: formData.area ? Number(formData.area) : undefined,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
        ownerName:
          `${formData.ownerFirstName} ${formData.ownerLastName}`.trim(),
        ownerPhone: formData.ownerContactNumber,
        ownerEmail: formData.ownerEmail,
        description: formData.description,
        amenities: formData.amenities,
        photos: formData.photos,
        status: formData.status,
      };

      console.log("Submitting house data:", houseData);

      // Call the actual API
      const response = await HouseService.createHouse(houseData);

      console.log("House created successfully:", response);

      // Create registration object for local state update
      const newRegistration: Registration = {
        id:
          response.data?.id ||
          `P-2024-${String(registrationsLength + 1).padStart(3, "0")}`,
        userId: formData.userId || "66c123456789abcd12345681",
        propertyType: formData.propertyType,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
        area: Number(formData.area) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        yearBuilt: Number(formData.yearBuilt) || 0,
        ownerFirstName: formData.ownerFirstName,
        ownerLastName: formData.ownerLastName,
        ownerEmail: formData.ownerEmail,
        ownerContactNumber: formData.ownerContactNumber,
        ownerAddress: formData.ownerAddress,
        description: formData.description,
        amenities: formData.amenities,
        photos: formData.photos,
        status: formData.status,
        createdAt: new Date().toISOString(),
        submittedBy: "Admin",
      };

      // Update local state
      onSubmit(newRegistration);

      // Show success popup
      setSuccessMessage("Property has been registered successfully!");
      setShowSuccessPopup(true);
    } catch (error: any) {
      console.error("Property registration failed:", error);

      // Handle different types of errors
      let errorMsg = "Failed to register property. Please try again.";

      if (typeof error === "string") {
        errorMsg = error;
      } else if (error?.message) {
        errorMsg = error.message;
      } else if (error?.error) {
        errorMsg = error.error;
      }

      setErrorMessage(errorMsg);
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Register New Property
                </h2>
                <p className="text-gray-600">
                  Add a new property to the system
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Property Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Property Information
                </h3>
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
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    {propertyTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="2500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Enter full property address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="-17.8292"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="66c123456789abcd12345678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Property description..."
                  />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Owner Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="ownerFirstName"
                    value={formData.ownerFirstName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="John"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="ownerLastName"
                    value={formData.ownerLastName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="ownerContactNumber"
                    value={formData.ownerContactNumber}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="+263 77 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Address *
                  </label>
                  <textarea
                    name="ownerAddress"
                    value={formData.ownerAddress}
                    onChange={handleInputChange}
                    rows={2}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Owner's residential address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Amenities
                </h3>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {commonAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => addAmenity(amenity)}
                      disabled={
                        formData.amenities.includes(amenity) || isSubmitting
                      }
                      className={`px-3 py-1 text-sm rounded-full border ${
                        formData.amenities.includes(amenity)
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    placeholder="Add custom amenity..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && addAmenity(newAmenity)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => addAmenity(newAmenity)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {formData.amenities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Amenities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          disabled={isSubmitting}
                          className="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Photos Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Camera className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={addPhoto}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Photo
                </button>
              </div>

              {formData.photos.length > 0 && (
                <div className="space-y-2">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Camera className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm">
                          {photo.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {photo.url}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Registration Status
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Needs Documents">Needs Documents</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Register Property
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative transform animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Close Button */}
            <button
              onClick={closeSuccessPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Popup Content */}
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              {/* Success Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Registration Successful!
              </h3>

              {/* Success Message */}
              <p className="text-gray-600 mb-6">{successMessage}</p>

              {/* Close Button */}
              <button
                onClick={closeSuccessPopup}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative transform animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Close Button */}
            <button
              onClick={closeErrorPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Popup Content */}
            <div className="p-8 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>

              {/* Error Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Registration Failed
              </h3>

              {/* Error Message */}
              <p className="text-gray-600 mb-6">{errorMessage}</p>

              {/* Close Button */}
              <button
                onClick={closeErrorPopup}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyRegistrationModal;
