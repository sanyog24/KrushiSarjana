import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/products"; // Update this if needed

// ✅ Add Product (Retailer Only)
export const addProduct = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/add-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Ensure cookies/session are sent
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add product";
  }
};

// ✅ Remove Product (Retailer Only)
export const removeProduct = async (productId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/remove-product/${productId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to remove product";
  }
};

// ✅ Edit Product (Retailer Only)
export const editProduct = async (productId, formData) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/edit-product/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update product";
  }
};

// ✅ Get Products (Uploaded by this Retailer)
export const getProductsByRetailer = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/my-products`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch your products";
  }
};

// ✅ Get All Products (Uploaded by all Retailers)
export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/all-products`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products";
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/category/${category}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products for this category";
  }
};

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/product/${productId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch product details";
  }
};

export const getAllProductsByName = async (productName) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/name/${productName}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products by name";
  }
};


// ✅ Add Review (Customer or Farmer)
export const addReview = async (productId, reviewData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/${productId}/review`, reviewData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add review";
  }
};

// ✅ Get Reviews for a Product
export const getReviews = async (productId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${productId}/reviews`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch reviews";
  }
};

// ✅ Delete Review (Only Review Owner or Admin)
export const deleteReview = async (productId, reviewId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/${productId}/review/${reviewId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete review";
  }
};