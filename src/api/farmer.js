import API from "./api";

const API_BASE_URL = "/farmers";

/**
 * @desc Create or Update Farmer Profile
 * @param {FormData} formData - Form data containing farmer details and profile image.
 * @param {string} token - JWT token for authentication (optional, will use stored token).
 * @returns {Promise<Object>} - Response data
 */
export const upsertFarmerProfile = async (formData, token) => {
  try {
    const response = await API.post(`${API_BASE_URL}/upsert-farmer`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in upsertFarmerProfile:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to update farmer profile");
  }
};

/**
 * @desc Get Farmer Details
 * @param {string} token - JWT token for authentication (optional, will use stored token).
 * @returns {Promise<Object>} - Farmer details
 */
export const getFarmerDetails = async (token) => {
  try {
    const response = await API.get(`${API_BASE_URL}/get-farmer`);

    return response.data;
  } catch (error) {
    console.error("Error in getFarmerDetails:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch farmer details");
  }

};

export const getFarmerById = async (farmerId) => {
  try {
    const response = await API.get(`${API_BASE_URL}/get-farmer/${farmerId}`);

    return response.data;
  } catch (error) {
    console.error("Error in getFarmerById:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch farmer details");
  }
};
