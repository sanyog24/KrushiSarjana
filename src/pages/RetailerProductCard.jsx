import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api/product.js";
import { AuthAPI } from "../api/api.js";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

function RetailerProductCard({ product, onEdit, onDelete }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found in localStorage.");
          return;
        }

        const decoded = jwtDecode(token);
        console.log("🔍 Decoded Token:", decoded);

        if (!decoded.id) {
          console.error("❌ User ID not found in token");
          return;
        }

        const userData = await AuthAPI.getUserById(decoded.id);
        if (!userData) {
          console.error("❌ User data not found.");
          return;
        }

        setUser(userData);
        setUserRole(userData.role);
        setUserId(userData._id);
        console.log("✅ User Data:", userData);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching products...");

        let fetchedProducts = await getAllProducts();

        if (!Array.isArray(fetchedProducts)) {
          throw new Error("Invalid product response format.");
        }

        console.log("📦 Raw Products:", fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("❌ Error fetching products:", error.message);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
        console.log("✅ Fetching complete, updating state.");
      }
    };

    if (userRole) {
      fetchProducts();
    }
  }, [userRole]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  console.log("📌 Products Before Filtering:", products);

  const filteredProducts = products.filter((product) => {
    if (!product || !product.sellerType || !product.seller) return false;

    if (userRole === "Farmer") return product.sellerType === "Retailer";
    if (userRole === "Customer") return product.sellerType === "Farmer";
    if (userRole === "Retailer") return product.seller === userId;
    return false;
  });

  console.log("✅ Filtered Products:", filteredProducts);

  return (
    <>
      {filteredProducts.map((product) => (
        <div
          key={product._id}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-300 text-center flex flex-col items-center"
        >
          <img
  src={product.image} // Ensure this is a valid Cloudinary URL
  alt={product.name}
  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border border-gray-300 shadow-md"
/>

          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-600 font-medium">{product.category}</p>
          <p className="text-sm text-gray-500">₹{product.price} (Per Unit)</p>
          <p className="text-sm text-gray-500">
            {product.quantity} {product.unit} Available
          </p>
          <p className="text-xs text-gray-400 italic mt-2">{product.details}</p>

          {/* Edit & Delete Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              onClick={() => onEdit(product)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              onClick={() => onDelete(product.name)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default RetailerProductCard;
