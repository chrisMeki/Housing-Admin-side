import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
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
  Bed,
  Bath,
  Square,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import AdminSidebar from "../components/sidebar";
import PropertyService from "../services/property_listings_Service";
import PropertyViewModal from "../components/property_listings/view_property";
import supabase from "../supabase_config/supabase_Config";

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
  propertyType: string; // Changed from 'type' to 'propertyType'
  image: string;
  images: string[];
  ownerName: string; // Changed from nested user object
  ownerEmail: string; // to individual owner fields
  ownerPhone: string;
  listedDate: string;
}

const PropertyListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  // Popup states
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // View modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<{
    id?: number;
    title: string;
    price: string;
    location: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    propertyType: string; // Changed from 'type' to 'propertyType'
    image: string;
    images: string[];
    ownerName: string; // Changed from nested user object
    ownerEmail: string; // to individual owner fields
    ownerPhone: string;
    imageFiles?: File[];
  }>({
    title: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    propertyType: "Apartment", // Changed from 'type' to 'propertyType'
    image: "",
    images: [],
    ownerName: "", // Changed from nested user object
    ownerEmail: "", // to individual owner fields
    ownerPhone: "",
    imageFiles: [],
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await PropertyService.getAllProperties();
        setProperties(response.data || response); // Adjust based on your API response structure
      } catch (err: any) {
        setError(err.message || "Failed to fetch properties");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const propertyTypes = [
    "Apartment",
    "House",
    "Condo",
    "Townhouse",
    "Penthouse",
  ];

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      propertyType: "Apartment", // Changed from 'type' to 'propertyType'
      image: "",
      images: [],
      ownerName: "", // Changed from nested user object
      ownerEmail: "", // to individual owner fields
      ownerPhone: "",
      imageFiles: [],
    });
  };

  // Popup functions
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setSuccessMessage("");
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorMessage("");
  };

  // View modal functions
  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedProperty(null);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadingImages(true);

      try {
        const imageUrls: string[] = [];
        const imageFiles: File[] = [];

        // Process each file
        for (const file of files) {
          // Create local preview
          const reader = new FileReader();
          const localUrl = await new Promise<string>((resolve) => {
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.readAsDataURL(file);
          });

          imageUrls.push(localUrl);
          imageFiles.push(file);
        }

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...imageUrls],
          image: imageUrls[0] || prev.image, // Set first image as main image for backward compatibility
          imageFiles: [...(prev.imageFiles || []), ...imageFiles],
        }));
      } catch (error) {
        console.error("Error processing files:", error);
        showErrorMessage("Failed to process selected images");
      } finally {
        setUploadingImages(false);
      }
    }
  };

  // Add function to remove individual images
  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const newImageFiles =
        prev.imageFiles?.filter((_, i) => i !== index) || [];

      return {
        ...prev,
        images: newImages,
        image: newImages[0] || "", // Update main image
        imageFiles: newImageFiles,
      };
    });
  };

  // Add Supabase upload function
  const uploadImageToSupabase = async (
    file: File,
    propertyTitle: string
  ): Promise<string> => {
    try {
      if (!file) throw new Error("No file provided");

      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Please upload an image (JPG, PNG)."
        );
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      // Create unique filename
      const fileExtension = file.name.split(".").pop();
      const sanitizedTitle = propertyTitle
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 50);
      const fileName = `${sanitizedTitle}/property_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExtension}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("property_listings")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("property_listings")
        .getPublicUrl(fileName);

      if (!publicData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      return publicData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setUploadingImages(true);

      // Upload images to Supabase if there are any
      let uploadedImageUrls: string[] = [];

      if (formData.imageFiles && formData.imageFiles.length > 0) {
        showSuccessMessage("Uploading images...");

        for (const file of formData.imageFiles) {
          try {
            const uploadedUrl = await uploadImageToSupabase(
              file,
              formData.title
            );
            uploadedImageUrls.push(uploadedUrl);
          } catch (uploadError) {
            console.error("Failed to upload image:", uploadError);
            // Continue with other images even if one fails
          }
        }
      }

      const propertyData = {
        title: formData.title,
        price: parseFloat(formData.price),
        location: formData.location,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        propertyType: formData.propertyType,
        image:
          uploadedImageUrls[0] ||
          formData.image ||
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
        images:
          uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images, // Include all images
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
      };

      if (editingProperty) {
        await PropertyService.updateProperty(
          editingProperty.id.toString(),
          propertyData
        );
        showSuccessMessage("Property updated successfully!");
      } else {
        await PropertyService.createProperty(propertyData);
        showSuccessMessage("Property added successfully!");
      }

      // Refresh properties list
      try {
        const response = await PropertyService.getAllProperties();
        const propertyData = response.data || response;
        if (Array.isArray(propertyData)) {
          setProperties(propertyData);
        }
      } catch (fetchError) {
        console.warn("Could not refresh properties list:", fetchError);
      }

      resetForm();
      setShowAddForm(false);
      setEditingProperty(null);
      setError(null);
    } catch (err: any) {
      console.error("Error saving property:", err);

      let errorMsg = "Failed to save property";
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      showErrorMessage(errorMsg);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleEdit = (property: Property) => {
    setFormData({
      ...property,
      price: property.price.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      imageFiles: undefined,
    });
    setEditingProperty(property);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await PropertyService.deleteProperty(id.toString());
        // Remove from local state
        setProperties((prev) => prev.filter((prop) => prop.id !== id));
        showSuccessMessage("Property deleted successfully!");
      } catch (err: any) {
        let errorMsg = "Failed to delete property";
        if (err.message) {
          errorMsg = err.message;
        }
        showErrorMessage(errorMsg);
        console.error("Error deleting property:", err);
      }
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
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
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
                Property Listings
              </h1>
              <p className="text-gray-600">
                Admin Dashboard - Manage all property listings
              </p>
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
                    <select className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                      <option value="All">All Types</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
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
                      {editingProperty ? "Edit Property" : "Add New Property"}
                    </h2>
                    <button
                      onClick={handleCancel}
                      className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Property Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Property Details
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Title
                        </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price ($)
                          </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property Type
                          </label>
                          <select
                            name="propertyType" // Changed from 'type' to 'propertyType'
                            value={formData.propertyType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {propertyTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bedrooms
                          </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bathrooms
                          </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Area (sq ft)
                          </label>
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
                          {editingProperty
                            ? "Change Property Images"
                            : "Upload Property Images"}
                        </label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, JPEG (MAX. 10MB each) - Multiple
                                  files allowed
                                </p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                disabled={uploadingImages}
                              />
                            </label>
                          </div>

                          {uploadingImages && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                                <span className="text-blue-800 text-sm">
                                  Processing images...
                                </span>
                              </div>
                            </div>
                          )}

                          {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {formData.images.map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={imageUrl}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                  {index === 0 && (
                                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                      Main
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Owner Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Owner Details
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner Name
                        </label>
                        <input
                          type="text"
                          name="ownerName"
                          value={formData.ownerName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner Email
                        </label>
                        <input
                          type="email"
                          name="ownerEmail"
                          value={formData.ownerEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner Phone
                        </label>
                        <input
                          type="tel"
                          name="ownerPhone"
                          value={formData.ownerPhone}
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
                        {editingProperty ? "Update Property" : "Add Property"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Properties List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Properties Found
                    </h3>
                    <p>Start by adding your first property listing.</p>
                  </div>
                ) : (
                  properties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Property Image */}
                      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop";
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                          {property.propertyType}
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {property.title}
                          </h3>
                          <span className="text-xl font-bold text-blue-600">
                            ${property.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm truncate">
                            {property.location}
                          </span>
                        </div>

                        {/* Property Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {property.bedrooms}
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {property.bathrooms}
                          </div>
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.area} sqft
                          </div>
                        </div>

                        {/* Owner Info */}
                        <div className="border-t pt-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <User className="w-4 h-4 mr-2" />
                            <span className="font-medium">
                              {property.ownerName}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="truncate">
                              {property.ownerEmail}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{property.ownerPhone}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(property)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(property)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Property View Modal */}
            {showViewModal && selectedProperty && (
              <PropertyViewModal
                property={selectedProperty}
                isOpen={showViewModal}
                onClose={closeViewModal}
                onEdit={() => {
                  closeViewModal();
                  handleEdit(selectedProperty);
                }}
                onDelete={() => {
                  closeViewModal();
                  handleDelete(selectedProperty.id);
                }}
              />
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
              <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
                <CheckCircle className="w-5 h-5" />
                <span>{successMessage}</span>
                <button
                  onClick={closeSuccessPopup}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Error Popup */}
            {showErrorPopup && (
              <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
                <AlertCircle className="w-5 h-5" />
                <span>{errorMessage}</span>
                <button
                  onClick={closeErrorPopup}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;
