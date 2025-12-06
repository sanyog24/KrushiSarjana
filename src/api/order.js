import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/orders";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-order`, orderData, {
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
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
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

    const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();
    console.log("Server response:", result);

    return result;
  } catch (error) {
    console.error("Error in updateOrderStatus API:", error);
    return { success: false, error };
  }
};

export const cancelOrder = async (orderId) => {
  try {
    console.log(`Attempting to cancel order: ${orderId}`);

    const response = await axios.delete(`${API_BASE_URL}/${orderId}/cancel`);
    
    console.log("Cancel order response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error canceling order:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};
