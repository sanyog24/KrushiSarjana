import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthAPI } from "../api/api.js";
import { jwtDecode } from "jwt-decode";
import { createOrder } from "../api/order.js";
import toast from "react-hot-toast";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);

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

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      if (!user || orderCreated) return;

      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        console.error("No session ID found");
        return;
      }

      // Get order details from sessionStorage
      const pendingOrderData = sessionStorage.getItem("pendingOrder");
      if (!pendingOrderData) {
        console.error("No pending order data found");
        return;
      }

      try {
        const orderDetails = JSON.parse(pendingOrderData);
        console.log("[Success] Creating order:", orderDetails);

        // Create the order in database
        const orderData = {
          buyerId: orderDetails.buyerId,
          productId: orderDetails.productId,
          paymentId: sessionId,
          subTotalAmount: orderDetails.subTotalAmount,
          totalAmount: orderDetails.totalAmount,
        };

        await createOrder(orderData);
        console.log("[Success] Order created successfully");
        
        // Clear pending order
        sessionStorage.removeItem("pendingOrder");
        setOrderCreated(true);
        toast.success("Order placed successfully!");
      } catch (error) {
        console.error("[Success] Error creating order:", error);
        toast.error("Order creation failed. Please contact support.");
      }
    };

    createOrderAfterPayment();
  }, [user, searchParams, orderCreated]);

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md mx-4 transform transition-all duration-500 hover:scale-105">
            {/* Animated Check Icon */}
            <div className="animate-bounce">
              <FaCheckCircle className="text-green-500 text-8xl mb-6 mx-auto" />
            </div>
    
            {/* Success Message */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your payment. Your transaction was completed successfully.
            </p>
    
            {/* Button with Gradient and Hover Effect */}
            <button
              onClick={handleRedirect}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Go to Dashboard
            </button>
    
         
          </div>
        </div>
    
  );
};

export default Success;
