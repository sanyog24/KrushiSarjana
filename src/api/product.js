import API from "./api";

const API_BASE_URL = "/products";

// ✅ Add Product (Retailer Only)
export const addProduct = async (formData) => {
  try {
    const res = await API.post(`${API_BASE_URL}/add-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add product";
  }
};

// ✅ Remove Product (Retailer Only)
export const removeProduct = async (productId) => {
  try {
    const res = await API.delete(`${API_BASE_URL}/remove-product/${productId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to remove product";
  }
};

// ✅ Edit Product (Retailer Only)
export const editProduct = async (productId, formData) => {
  try {
    const res = await API.put(`${API_BASE_URL}/edit-product/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update product";
  }
};

// ✅ Get Products (Uploaded by this Retailer)
export const getProductsByRetailer = async () => {
  try {
    const res = await API.get(`${API_BASE_URL}/my-products`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch your products";
  }
};

// ✅ Get All Products (Uploaded by all Retailers)
export const getAllProducts = async () => {
  try {
    const res = await API.get(`${API_BASE_URL}/all-products`);
    return res.data || [];
  } catch (error) {
    console.error("getAllProducts error:", error.response?.data || error.message);
    throw error.response?.data?.message || error.message || "Failed to fetch products";
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const res = await API.get(`${API_BASE_URL}/category/${category}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products for this category";
  }
};

export const getProductById = async (productId) => {
  try {
    const res = await API.get(`${API_BASE_URL}/product/${productId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch product details";
  }
};

export const getAllProductsByName = async (productName) => {
  try {
    const res = await API.get(`${API_BASE_URL}/name/${productName}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products by name";
  }
};


// ✅ Add Review (Customer or Farmer)
export const addReview = async (productId, reviewData) => {
  try {
    const res = await API.post(`${API_BASE_URL}/${productId}/review`, reviewData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add review";
  }
};

// ✅ Get Reviews for a Product
export const getReviews = async (productId) => {
  try {
    const res = await API.get(`${API_BASE_URL}/${productId}/reviews`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch reviews";
  }
};

// ✅ Delete Review (Only Review Owner or Admin)
export const deleteReview = async (productId, reviewId) => {
  try {
    const res = await API.delete(`${API_BASE_URL}/${productId}/review/${reviewId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete review";
  }
};