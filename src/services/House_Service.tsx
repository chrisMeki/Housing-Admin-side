import axios from "axios";

const BASE_URL =
  "https://housing-backend-xwrj.onrender.com/api/v1/housing_route"; // Replace with actual house route

/**
 * Service for handling house-related API requests
 */
const HouseService = {
  /**
   * Fetch all houses
   */
  getAllHouses: async (): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve houses";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get a house by ID
   */
  getHouseById: async (id: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve house";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Get houses by user ID
   */
  getHousesByUserId: async (userId: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/getbyuser/${userId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to retrieve user houses";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Create a new house
   */
  createHouse: async (houseData: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, houseData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to create house";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Update an existing house
   */
  updateHouse: async (id: string, houseData: any): Promise<any> => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, houseData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to update house";
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  /**
   * Delete a house
   */
  deleteHouse: async (id: string): Promise<any> => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || "Failed to delete house";
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

export default HouseService;
