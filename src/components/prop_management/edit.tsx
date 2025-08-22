import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type PropertyType =
  | "Single Family Home"
  | "Apartment"
  | "Condominium"
  | "Townhouse"
  | "Duplex"
  | "Studio"
  | "Commercial"
  | "Land";

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
  area: number;
  yearBuilt?: number;
  description?: string;
  amenities: string[];
  photos: Photo[];
  status: "Pending" | "Approved" | "Rejected" | "Needs Documents";
  createdAt: string;
  updatedAt: string;
}

interface EditPropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  loading: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  property,
  loading,
  onClose,
  onSave,
}) => {
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

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

  // Initialize editing property when modal opens or property changes
  useEffect(() => {
    if (property) {
      setEditingProperty({ ...property });
    }
  }, [property]);

  const handleSave = () => {
    if (
      !editingProperty ||
      !editingProperty.address ||
      !editingProperty.ownerName ||
      !editingProperty.ownerPhone
    ) {
      return;
    }

    onSave(editingProperty);
  };

  const handleClose = () => {
    setEditingProperty(null);
    onClose();
  };

  if (!isOpen || !editingProperty) {
    return null;
  }

  return (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Property</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={editingProperty.propertyType}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  propertyType: e.target.value as PropertyType,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={editingProperty.address}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter property address"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={editingProperty.lat || ""}
                onChange={(e) =>
                  setEditingProperty({
                    ...editingProperty,
                    lat: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Latitude"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={editingProperty.lng || ""}
                onChange={(e) =>
                  setEditingProperty({
                    ...editingProperty,
                    lng: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Longitude"
              />
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Owner Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                value={editingProperty.ownerName}
                onChange={(e) =>
                  setEditingProperty({
                    ...editingProperty,
                    ownerName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter owner name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Phone *
              </label>
              <input
                type="tel"
                value={editingProperty.ownerPhone}
                onChange={(e) =>
                  setEditingProperty({
                    ...editingProperty,
                    ownerPhone: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter owner phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Email
              </label>
              <input
                type="email"
                value={editingProperty.ownerEmail || ""}
                onChange={(e) =>
                  setEditingProperty({
                    ...editingProperty,
                    ownerEmail: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter owner email (optional)"
              />
            </div>
          </div>

          {/* Property Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Property Specifications
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProperty.bedrooms}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      bedrooms: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProperty.bathrooms}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      bathrooms: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProperty.area}
                  onChange={(e) =>
                    setEditingProperty({
                      ...editingProperty,
                      area: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Built
              </label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={editingProperty.yearBuilt || ""}
                onChange={(e) =>
                  setEditingProperty({
                    ...editingProperty,
                    yearBuilt: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Year built (optional)"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editingProperty.description || ""}
              onChange={(e) =>
                setEditingProperty({
                  ...editingProperty,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Property description (optional)"
            />
          </div>

          {/* Amenities Display (Read-only for now) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {editingProperty.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {editingProperty.amenities.length === 0 && (
                <p className="text-gray-500 text-sm">No amenities added</p>
              )}
            </div>
          </div>

          {/* Photos Display (Read-only for now) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            {editingProperty.photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {editingProperty.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No photos added</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={
              loading ||
              !editingProperty.address ||
              !editingProperty.ownerName ||
              !editingProperty.ownerPhone
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Property"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
