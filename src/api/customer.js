import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/customers"; // Update this if needed

// ✅ Upsert (Create or Update) Customer with Profile Image Upload
export const upsertCustomer = async (token, formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upsert`, formData, {
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


// ✅ Get Customer Details by User ID
export const getCustomerDetails = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/customers/customer-details", {
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


