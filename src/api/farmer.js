import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/farmers";

/**
 * @desc Create or Update Farmer Profile
 * @param {FormData} formData - Form data containing farmer details and profile image.
 * @param {string} token - JWT token for authentication.
 * @returns {Promise<Object>} - Response data
 */
export const upsertFarmerProfile = async (formData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upsert-farmer`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Include cookies if needed
    });

    return response.data;
  } catch (error) {
    console.error("Error in upsertFarmerProfile:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to update farmer profile");
  }
};

/**
 * @desc Get Farmer Details
 * @param {string} token - JWT token for authentication.
 * @returns {Promise<Object>} - Farmer details
 */
export const getFarmerDetails = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-farmer`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error in getFarmerDetails:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch farmer details");
  }

};

export const getFarmerById = async (farmerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-farmer/${farmerId}`);

    return response.data;
  } catch (error) {
    console.error("Error in getFarmerById:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch farmer details");
  }
};

