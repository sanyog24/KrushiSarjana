import { useState, useEffect } from "react";
import { getAllProducts } from "../api/product.js";
import { AuthAPI } from "../api/api.js";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

export default function Products() {
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
        if (!token) return;

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
    if (!product || !product.sellerType) return false;

    if (userRole === "Farmer") return product.sellerType === "Retailer";
    if (userRole === "Customer") return product.sellerType === "Farmer";
    if (userRole === "Retailer") return product.seller === userId;
    return false;
  });

  console.log("✅ Filtered Products:", filteredProducts);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        {userRole === "Farmer"
          ? "Buy Farming Products"
          : userRole === "Customer"
          ? "Fresh Produce from Farmers"
          : "Your Listed Products"}
      </h1>

      {filteredProducts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300"
            >
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-lg font-bold text-green-700">₹{product.price}</p>
                <p className="text-sm text-gray-600">{product.stock} {product.unit} available</p>
              </div>
              <div className="flex justify-between p-4 border-t">
                <button className="text-blue-500 font-semibold hover:underline">View Details</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-500">No products available.</p>
      )}
    </div>
  );
}



