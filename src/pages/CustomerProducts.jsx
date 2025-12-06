import React, { useEffect, useState } from "react";
import ProductCard from "../components/ui/CustomerProCard";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { getAllProducts } from "../api/product.js";
import { AuthAPI } from "../api/api.js";
import { jwtDecode } from "jwt-decode";

const categories = [
  { name: "Vegetables", icon: "🥦" },
  { name: "Fruits", icon: "🍏" },
  { name: "Cereals", icon: "🌾" },
  { name: "Grains", icon: "🌽" },
];

function CustomerProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        if (!decoded.id) return;

        const userData = await AuthAPI.getUserById(decoded.id);
        if (!userData) return;

        setUser(userData);
        setUserRole(userData.role);
        setUserId(userData._id);
      } catch (error) {
        setError("Failed to fetch user data.");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let fetchedProducts = await getAllProducts();

        if (!Array.isArray(fetchedProducts)) {
          throw new Error("Invalid product response format.");
        }

        setProducts(fetchedProducts);
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchProducts();
    }
  }, [userRole]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      console.log("Product Seller : "+product.seller);
      console.log("Seller Name : " + product.sellerType);
      
      
      if (!product || !product.sellerType) return false;
      if (userRole === "Farmer") return product.sellerType === "Retailer";
      if (userRole === "Customer") return product.sellerType === "Farmer";
      if (userRole === "Retailer") return product.seller === userId;
      return false;
    });
    setFilteredProducts(
      selectedCategory === "All"
        ? filtered
        : filtered.filter((product) => product.category === selectedCategory)
    );
  }, [products, selectedCategory, userRole, userId]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        if (!decoded.id) return console.error("User ID not found in token");

        const userData = await AuthAPI.getUserById(decoded.id);
        setUser(userData);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);


  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/4 bg-[#0c1c14] text-white p-4 flex flex-col">
      <div className="flex items-center justify-center md:justify-start mt-4 mb-6">
          {user ? (
    user.avatar ? (
      <img
        src={user.avatar}
        alt="User Avatar"
        className="w-12 h-12 rounded-full shadow-md"
      />
    ) : (
      <div className="w-12 h-12 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md text-lg">
        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
      </div>
    )
  ) : (
    <div className="w-12 h-12 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md">
      Loading...
    </div>
  )}
  <span className="text-2xl font-bold ">🌿 KrishiSarjana</span>

        </div>
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`bg-[#1b3a28] p-4 rounded-lg text-sm ${
              selectedCategory === "All" ? "bg-green-600" : ""
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            📦 All Products
          </button>
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`bg-[#1b3a28] p-4 rounded-lg text-sm ${
                selectedCategory === cat.name ? "bg-green-600" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <button
          className="w-full mt-4 p-4 bg-[#1b3a28] rounded-lg hover:bg-[#21503a] flex items-center gap-3 justify-center"
          onClick={() => navigate("/CustomerOrder")}
        >
          <FaShoppingCart className="text-red-400 text-2xl" />
          <span className="text-sm text-gray-300">Orders</span>
        </button>
      </aside>

      <div className="w-3/4 min-h-screen p-6 bg-[#f3f3f3] overflow-y-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                category={product.category}
                description={product.description}
                image={product.image}
                sellerId={product.seller} // Passing seller._id
                sellerName={product.seller?.name} // Passing seller.name
                sellerRole={product.sellerType} // Passing seller.role
                reviews={product.reviews}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}

export default CustomerProduct;
