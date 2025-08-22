import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Plus,
  Menu,
  Bell,
  X
} from "lucide-react";
import AdminSidebar from "../components/sidebar";
import ReportsService from "../services/reports_Service";
import UploadReportModal from "../components/reportss.tsx/add_Report";
import Swal from "sweetalert2";

interface Report {
  _id: string;
  title: string;
  description: string;
  document: {
    name: string;
    fileType: string;
  };
  createdAt: string;
  updatedAt: string;
}

const getFileTypeDisplayName = (fileType) => {
  if (!fileType) return "Unknown";

  const typeMap = {
    pdf: "PDF",
    "application/pdf": "PDF",
    doc: "DOC",
    "application/msword": "DOC",
    docx: "DOCX",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    xls: "XLS",
    "application/vnd.ms-excel": "XLS",
    xlsx: "XLSX",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  };

  const cleanType = fileType.toLowerCase();
  return (
    typeMap[cleanType] || fileType.split(".").pop()?.toUpperCase() || "Unknown"
  );
};

// Main Reports Component
const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);
  
  // Fetch reports on component mount
  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ReportsService.getAllReports();
      const reportsData = (response.reports ||
        response.data ||
        response ||
        []) as Report[];
      setReports(reportsData);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handleSubmitReport function to work with the modal
  const handleSubmitReport = async (formData) => {
    try {
      // Create FormData for file upload if your API expects it
      const reportData = {
        title: formData.title,
        description: formData.description,
        userId: formData.userId,
        // Add other fields as needed by your API
      };

      const response = await ReportsService.createReport(reportData);

      // Refresh the reports list
      await fetchReports();
      
      // Close the modal
      setIsModalOpen(false);
      
      // Show success message with SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Report uploaded successfully!",
        confirmButtonText: "OK",
        background: "#fff",
        customClass: {
          popup: "rounded-lg shadow-xl"
        }
      });
    } catch (error) {
      console.error("Error uploading report:", error);
      // Show error message with SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "There was an error uploading the report. Please try again.",
        confirmButtonText: "OK",
        background: "#fff",
        customClass: {
          popup: "rounded-lg shadow-xl"
        }
      });
    }
  };

  const handleDeleteReport = async (id) => {
    // Use SweetAlert2 for confirmation instead of default confirm
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      customClass: {
        popup: "rounded-lg shadow-xl"
      }
    });
    
    if (result.isConfirmed) {
      try {
        await ReportsService.deleteReport(id);
        setReports(reports.filter((report) => report._id !== id));
        
        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "The report has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
          background: "#fff",
          customClass: {
            popup: "rounded-lg shadow-xl"
          }
        });
      } catch (error) {
        console.error("Failed to delete report:", error);
        // Show error message
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the report.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#fff",
          customClass: {
            popup: "rounded-lg shadow-xl"
          }
        });
      }
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return "📄";
      case "xlsx":
      case "xls":
        return "📊";
      case "docx":
      case "doc":
        return "📝";
      default:
        return "📁";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      report.document.fileType?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 relative">
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
              Reports Management
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="bg-white shadow-sm border-b hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Reports Management
                </h1>
                <p className="text-gray-600">
                  Manage housing registration reports and documents
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Reports Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
                >
                  <option value="all">All File Types</option>
                  <option value="pdf">PDF Documents</option>
                  <option value="xlsx">Excel Files</option>
                  <option value="docx">Word Documents</option>
                  <option value="doc">DOC Files</option>
                </select>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center w-full md:w-auto justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Report
              </button>
            </div>

            {/* Reports Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading reports...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchReports}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          File Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Last Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReports.map((report) => (
                        <tr key={report._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                                <span className="text-lg">
                                  {getFileTypeIcon(report.document?.fileType)}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {report.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {report.document?.name}
                                </div>
                                <div className="text-xs text-gray-500 lg:hidden mt-1">
                                  {getFileTypeDisplayName(
                                    report.document?.fileType
                                  )}{" "}
                                  • {formatDate(report.createdAt)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {report.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {getFileTypeDisplayName(report.document?.fileType)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {formatDate(report.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {formatDate(report.updatedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                title="View Document"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteReport(report._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Report"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!isLoading && !error && filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No reports found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Get started by uploading your first report."}
                  </p>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Reports
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  PDF Documents
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter((r) => r.document.fileType === "pdf").length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  Recent Uploads
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    reports.filter((r) => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(r.createdAt) > weekAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Upload Report Modal - Proper portal-style modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
            
            {/* Modal Content */}
            <div className="p-6">
              <UploadReportModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitReport}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;