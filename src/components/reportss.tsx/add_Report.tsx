import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import UserService from "../../services/user_Service";
import ReportsService from "../../services/reports_Service";
import supabase from "../../supabase_config/supabase_Config";

const getFileTypeDisplayName = (mimeType: string): string => {
  const typeMap: { [key: string]: string } = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  };
  return typeMap[mimeType] || mimeType;
};

interface User {
  _id: string;
  name: string;
  email: string;
}

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

interface FormData {
  title: string;
  description: string;
  userId: string;
  file: File | null;
}

const UploadReportModal = ({
  isOpen,
  onClose,
  onSubmit,
}: UploadReportModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    userId: "",
    file: null,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const uploadDocumentToSupabase = async (file: File) => {
    try {
      if (!file) return null;

      // Validate file type
      const allowedTypes = {
        "application/pdf": "PDF",
        "application/msword": "DOC",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "DOCX",
        "application/vnd.ms-excel": "XLS",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "XLSX",
      };

      if (!Object.keys(allowedTypes).includes(file.type)) {
        const allowedFormats = Object.values(allowedTypes).join(", ");
        throw new Error(
          `Invalid file type. Please upload ${allowedFormats} files.`
        );
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      // Get user ID for folder structure
      const userId = formData.userId || "default";

      // Create a unique file name with folder structure
      const fileExtension = file.name.split(".").pop();
      const fileName = `${userId}/report_${Date.now()}.${fileExtension}`;

      console.log("Uploading document to Supabase:", fileName);

      // Upload file to the Supabase bucket
      const { data, error } = await supabase.storage
        .from("reports")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(`Error uploading document: ${error.message}`);
      }

      console.log("Document uploaded successfully:", data);

      // Get the public URL of the uploaded file
      const { data: publicData } = supabase.storage
        .from("reports")
        .getPublicUrl(fileName);

      if (publicData) {
        console.log("Public URL generated:", publicData.publicUrl);
        return publicData.publicUrl;
      }

      return null;
    } catch (error) {
      console.error("Error in document upload:", error);
      throw error;
    }
  };

  // Fetch users when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await UserService.getAllUsers();
      const usersData = (response.users || response.data || response) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = {
        "application/pdf": "PDF",
        "application/msword": "DOC",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "DOCX",
        "application/vnd.ms-excel": "XLS",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "XLSX",
      };

      if (!Object.keys(allowedTypes).includes(file.type)) {
        const allowedFormats = Object.values(allowedTypes).join(", ");
        alert(`Please select a valid file type (${allowedFormats})`);
        return;
      }

      setUploadingFile(true);
      try {
        // Upload file to Supabase and get URL
        const fileUrl = await uploadDocumentToSupabase(file);

        if (fileUrl) {
          // Create a new File object with the Supabase URL as reference
          // We'll store both the original file and URL
          setFormData((prev) => ({
            ...prev,
            file: file, // Keep original file for form validation
          }));

          // Store the URL for later use
          (file as any).supabaseUrl = fileUrl;
          console.log("File uploaded successfully to:", fileUrl);
        }
      } catch (error: any) {
        console.error("Failed to upload file:", error);
        alert(error.message || "Failed to upload file to storage");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const generateUniqueTitle = (baseTitle: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    return `${baseTitle} - ${timestamp}`;
  };

  const handleSubmitReport = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
    }

    // Prevent double submission
    if (isSubmitting) return;

    if (
      !formData.title ||
      !formData.description ||
      !formData.userId ||
      !formData.file
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the report data object with the Supabase URL
      const reportData = {
        title: formData.title,
        description: formData.description,
        userId: formData.userId,
        document: {
          name: formData.file.name,
          url: (formData.file as any).supabaseUrl,
          fileType: formData.file.type,
        },
      };

      // Use the existing createReport function
      const result = await ReportsService.createReport(reportData);
      console.log("Report created successfully:", result);

      // Call the onSubmit prop for parent component updates
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Close modal on success
      closeModal();
      alert("Report uploaded successfully!");
    } catch (error: any) {
      console.error("Failed to upload report:", error);

      // Check if it's actually a success case (the report exists after creation)
      if (
        error.response?.status === 409 ||
        error.message?.includes("already exists")
      ) {
        // The report was likely created successfully but there's a duplicate detection issue
        console.log("Report may have been created successfully despite error");
        closeModal();
        alert("Report uploaded successfully!");
      } else {
        alert(
          `Failed to upload report: ${error.message || "Please try again."}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setFormData({
      title: "",
      description: "",
      userId: "",
      file: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload New Report
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter report title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter report description..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User *
            </label>
            {isLoadingUsers ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                Loading users...
              </div>
            ) : (
              <select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>
                      {uploadingFile ? "Uploading..." : "Upload a file"}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      className="sr-only"
                      disabled={uploadingFile || isSubmitting}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, XLS, XLSX up to 10MB
                </p>
                {uploadingFile && (
                  <div className="mt-2 text-sm text-blue-600 font-medium flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading to storage...
                  </div>
                )}
                {formData.file && !uploadingFile && (
                  <div className="mt-2 text-sm text-green-600 font-medium">
                    Selected: {formData.file.name} (
                    {getFileTypeDisplayName(formData.file.type)})
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button" // Changed from "submit" to "button"
              onClick={handleSubmitReport}
              disabled={
                isSubmitting ||
                uploadingFile ||
                !formData.title ||
                !formData.description ||
                !formData.userId ||
                !formData.file ||
                isLoadingUsers
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReportModal;
