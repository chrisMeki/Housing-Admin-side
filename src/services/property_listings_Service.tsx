import axios from "axios";

const BASE_URL =
  "https://housing-backend-xwrj.onrender.com/api/v1/property_listings_route"; 

/**
 * Service for handling property-related API requests
 */
const PropertyService = {
  /**
   * Fetch all properties
   */
  getAllProperties: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve properties";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get a property by ID
   */
  getPropertyById: async (id: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve property";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get properties by user ID
   */
  getPropertiesByUserId: async (userId: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getbyuser/${userId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve user properties";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Create a new property
   */
  createProperty: async (propertyData: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, propertyData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to create property";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Update an existing property
   */
  updateProperty: async (id: string, propertyData: any): Promise<any> => {
    try {
      const response = await axios.put(
        `${BASE_URL}/update/${id}`,
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to update property";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Delete a property
   */
  deleteProperty: async (id: string): Promise<any> => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to delete property";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },
};

/**
 * Helper function to get the auth token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem("adminToken");
};

export default PropertyService;
