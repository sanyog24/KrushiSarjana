import API from "./api";

const API_BASE_URL = "/customers";

// ✅ Upsert (Create or Update) Customer with Profile Image Upload
export const upsertCustomer = async (token, formData) => {
  try {
    const response = await API.post(`${API_BASE_URL}/upsert`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating profile";
  }
};


// ✅ Get Customer Details by User ID
export const getCustomerDetails = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/customer-details`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
    });

    console.log("Profile Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }

};

