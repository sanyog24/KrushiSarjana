import API from "./api";

const API_URL = "/retailers";

// ✅ Get Retailer Profile
export const getRetailerProfile = async () => {
  try {
    const response = await API.get(`${API_URL}/get-profile`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Profile Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};




// ✅ Edit Retailer Profile (with optional profile image)
export const editRetailerProfile = async (token, formData) => {
  try {
    const response = await API.post(`${API_URL}/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating profile";
  }
};
