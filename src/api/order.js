import API from "./api";

const API_BASE_URL = "/orders";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await API.post(`${API_BASE_URL}/create-order`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error;
  }
};

// Get orders for a specific user
export const getUserOrders = async (userId) => {
  try {
    const response = await API.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error.response?.data || error.message);
    throw error;
  }
};

// Update order status (Accept/Reject)
export const updateOrderStatus = async (orderId, updateData) => {
  try {
    console.log("Sending update request:", updateData);

    const response = await API.put(`${API_BASE_URL}/${orderId}/status`, updateData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateOrderStatus API:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const cancelOrder = async (orderId) => {
  try {
    console.log(`Attempting to cancel order: ${orderId}`);

    const response = await API.delete(`${API_BASE_URL}/${orderId}/cancel`);
    
    console.log("Cancel order response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error canceling order:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
