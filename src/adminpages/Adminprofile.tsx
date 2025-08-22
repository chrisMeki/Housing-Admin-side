import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Shield,
  Users,
  Settings,
  FileText,
  Home,
  Calendar,
  Phone,
  Mail,
  Edit3,
  Camera,
  Menu,
  Save,
  X,
} from "lucide-react";
import AdminSidebar from "../components/sidebar";
import AdminService from "../services/admin_Service"; // Adjust path as needed

// TypeScript interfaces
interface AdminData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form state for editing
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Get admin ID from token or localStorage
  const getAdminId = (): string | null => {
    const token = localStorage.getItem("adminToken");
    if (!token) return null;

    try {
      // Decode JWT token to get admin ID
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload._id || payload.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const adminId = getAdminId();

        if (!adminId) {
          setError("Admin ID not found. Please log in again.");
          return;
        }

        const response = await AdminService.getAdminById(adminId);
        const admin: AdminData = response.data || response;

        setAdminData(admin);
        setFormData({
          firstName: admin.firstName || "",
          lastName: admin.lastName || "",
          email: admin.email || "",
          contactNumber: admin.contactNumber || "",
        });
      } catch (err: any) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const adminId = getAdminId();
      if (!adminId) {
        setError("Admin ID not found. Please log in again.");
        return;
      }

      const response = await AdminService.updateAdmin(adminId, formData);
      const updatedAdmin: AdminData = response.data || response;

      setAdminData(updatedAdmin);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New passwords do not match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        return;
      }

      setUpdating(true);
      setError("");
      setSuccess("");

      const adminId = getAdminId();
      if (!adminId) {
        setError("Admin ID not found. Please log in again.");
        return;
      }

      // Update password
      await AdminService.updateAdmin(adminId, {
        password: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Password updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error updating password:", err);
      setError(err.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const recentActivities = [
    {
      action: "Profile information updated",
      time: "2 hours ago",
      reference: "PROFILE-001",
    },
    {
      action: "Password changed",
      time: "1 week ago",
      reference: "SECURITY-001",
    },
    {
      action: "Login from new device",
      time: "2 weeks ago",
      reference: "LOGIN-001",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Failed to load admin data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${adminData.firstName} ${adminData.lastName}`;
  const initials = `${adminData.firstName?.[0] || ""}${
    adminData.lastName?.[0] || ""
  }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-blue-600 p-2 rounded-md hover:bg-blue-50"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Admin Profile</h1>
          <div className="w-6"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
              <button
                onClick={() => setError("")}
                className="float-right text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                {/* Admin Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {initials}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">
                    {fullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ID: {adminData._id?.slice(-8) || "N/A"}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mt-2">
                    <Shield className="w-4 h-4 mr-1" />
                    Administrator
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {[
                    { id: "profile", label: "Admin Profile", icon: User },
                    {
                      id: "activities",
                      label: "Recent Activities",
                      icon: Users,
                    },
                    { id: "security", label: "Security Settings", icon: Lock },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === id
                          ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Admin Information
                      </h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        disabled={updating}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">
                            {adminData.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">
                            {adminData.lastName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center py-2">
                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-900">{adminData.email}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center py-2">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-900">
                              {adminData.contactNumber}
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Created
                        </label>
                        <div className="flex items-center py-2">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <p className="text-gray-900">
                            {adminData.createdAt
                              ? new Date(
                                  adminData.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Updated
                        </label>
                        <div className="flex items-center py-2">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <p className="text-gray-900">
                            {adminData.updatedAt
                              ? new Date(
                                  adminData.updatedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-6 flex space-x-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={updating}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                        >
                          {updating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              firstName: adminData.firstName || "",
                              lastName: adminData.lastName || "",
                              email: adminData.email || "",
                              contactNumber: adminData.contactNumber || "",
                            });
                          }}
                          disabled={updating}
                          className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "activities" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Recent Activities
                  </h2>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900">
                            {activity.action}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Reference: {activity.reference}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button className="text-purple-600 hover:text-purple-800 font-medium">
                      View All Activities
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handlePasswordUpdate}
                          disabled={
                            updating ||
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword
                          }
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                        >
                          {updating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Account Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account ID:</span>
                          <span className="font-mono text-sm">
                            {adminData._id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Status:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Last Password Change:
                          </span>
                          <span className="text-sm text-gray-500">
                            {adminData.updatedAt
                              ? new Date(
                                  adminData.updatedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
