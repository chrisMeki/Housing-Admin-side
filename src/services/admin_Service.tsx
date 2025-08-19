import axios from "axios";

const BASE_URL = "https://housing-backend-xwrj.onrender.com/api/v1/admin_route"; // Replace with actual admin route

/**
 * Service for handling admin-related API requests, including auth
 */
const AdminService = {
  /**
   * Admin signup
   */
  signup: async (adminData: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, adminData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to sign up admin";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Admin login
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to log in";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Fetch all admins
   */
  getAllAdmins: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve admins";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get an admin by ID
   */
  getAdminById: async (id: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve admin";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Update an existing admin
   */
  updateAdmin: async (id: string, adminData: any): Promise<any> => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, adminData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to update admin";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Delete an admin
   */
  deleteAdmin: async (id: string): Promise<any> => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to delete admin";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Admin logout
   */
  logout: (): void => {
    localStorage.removeItem("adminToken");
  },
};

/**
 * Helper function to get the auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("adminToken");
};

export default AdminService;
