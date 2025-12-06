import axios from "axios";

const API_URL = "http://localhost:5000/api/retailers"; // Change URL if deployed

// ✅ Get Retailer Profile
export const getRetailerProfile = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/retailers/get-profile", {
      method: "GET",
      credentials: "include", // ✅ Ensures cookies are sent
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Profile Data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
};




// ✅ Edit Retailer Profile (with optional profile image)
export const editRetailerProfile = async (token, formData) => {
  try {
    const response = await axios.post(`${API_URL}/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // ✅ Ensures cookies are sent if needed
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating profile";
  }
};

