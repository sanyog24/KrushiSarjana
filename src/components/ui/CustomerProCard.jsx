import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaTimes, FaExchangeAlt, FaStar } from "react-icons/fa";
import { AuthAPI } from "../../api/api.js";
// import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import AddToCart from "./AddToCart.jsx";
import Compare from "./Compare.jsx";

const ProductCard = ({id, name, price, category, description, image, onCompare,sellerId, sellerName, sellerRole, reviews }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState("logistic");
  console.log("*****Product ID : " + id);
  
  const totalReviews = reviews?.length || 0;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

  // Dummy retailer data for comparison with varied prices
  const [farmerProducts] = useState([
    { name: "Farmer A", price: price - Math.floor(Math.random() * 10), location: "Village X", description: "Organically grown with natural fertilizers." },
    { name: "Farmer B", price: price - Math.floor(Math.random() * 5), location: "Village Y", description: "Pesticide-free and handpicked." },
    { name: "Farmer C", price: price + Math.floor(Math.random() * 7), location: "Village Z", description: "Fresh from the farm, packed with nutrients." },
    { name: "Farmer D", price: price - Math.floor(Math.random() * 8), location: "Village W", description: "Sustainably farmed with eco-friendly methods." },
  ]);

  const handleCompareClick = () => {
    setShowCompare(true);
  };

  const handleAddToCart = () => {
    setShowCartPopup(true);
  };

  const calculateSubtotal = () => {
    const basePrice = price * quantity;
    const deliveryCharge = deliveryType === "logistic" ? 50 : 0; // Delivery charge only for logistic
    return basePrice + deliveryCharge;
  };

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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl transition w-full flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-300 rounded-full mb-4">
        {image && <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />}
      </div>
      <h3 className="text-lg font-semibold text-center">{name}</h3>
      <p className="text-center text-xl font-bold">₹{price}</p>
      <button
        className="w-40 bg-[#112b1c] text-white py-2 px-4 mt-3 flex items-center justify-center gap-2 rounded-lg"
        onClick={() => setShowDetails(true)}
      >
        Purchase <FaShoppingCart />
      </button>

      {/* Purchase Details Pop-up */}
      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 border-2 border-black relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={() => setShowDetails(false)}>
              <FaTimes size={20} />
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
              <div className="w-full md:w-1/3">
                <div className="w-48 h-48 bg-gray-300 rounded-lg mx-auto overflow-hidden">
                  {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
                </div>
              </div>
              {/* Details Section */}
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-semibold">{name}</h3>
                <p className="text-lg text-gray-700 font-semibold">₹{price}</p>
                <p className="text-sm text-gray-500 italic">{category}</p>
                <p className="text-gray-600 mt-3">{description}</p>
                <div className="mt-4">
                  <label className="block text-gray-700">Available Quantity:</label>
                  <p className="text-gray-700 font-semibold">50 units</p> {/* Dummy available quantity */}
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Product Reviews:</label>
                  <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                    <span className="text-gray-600 ml-2">({totalReviews} reviews)</span>
                  </div>
                </div>
                <button
                  className="w-full bg-[#112b1c] text-white py-2 mt-5 flex items-center justify-center gap-2 rounded-lg"
                  onClick={handleAddToCart}
                >
                  Add To Cart <FaShoppingCart />
                </button>
                <button
                  className="w-full bg-gray-700 text-white py-2 mt-3 flex items-center justify-center gap-2 rounded-lg"
                  onClick={handleCompareClick}
                >
                  Compare <FaExchangeAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Prices Pop-up */}
      {showCompare && (
        <Compare
        id={id}
        name={name}
        price={price}
        image={image}
        category={category}
        description={description}
        sellerId={sellerId}
        sellerName={sellerName}
        sellerRole={sellerRole}
        onClose={() => setShowCartPopup(false)}
        />
      )}

      {/* Add to Cart Pop-up */}
      {showCartPopup && (
        <AddToCart
        id={id}
        name={name}
        price={price}
        image={image}
        category={category}
        description={description}
        sellerId={sellerId}
        sellerName={sellerName}
        sellerRole={sellerRole}
        onClose={() => setShowCartPopup(false)}
      />
    )}
    </div>
  );
};

export default ProductCard;