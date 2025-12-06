import React, { useEffect, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/api.js";
import { jwtDecode } from "jwt-decode";

const Cancel = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

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

  const handleRedirect = () => {
    if (!user || !user.role) {
      console.error("User role not found");
      return;
    }

    switch (user.role) {
      case "Customer":
        navigate("/customer-dashboard");
        break;
      case "Farmer":
        navigate("/farmer-dashboard");
        break;
      case "Retailer":
        navigate("/retailer-dashboard");
        break;
      default:
        console.error("Invalid role");
        navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md mx-4 transform transition-all duration-500 hover:scale-105">
        {/* Animated Cross Icon */}
        <div className="animate-bounce">
          <FaTimesCircle className="text-red-500 text-8xl mb-6 mx-auto" />
        </div>

        {/* Cancel Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. If this was a mistake, you can try again.
        </p>

        {/* Button with Gradient and Hover Effect */}
        <button
          onClick={handleRedirect}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Cancel;
