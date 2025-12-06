import React, { useState, useEffect } from "react";
import { FaBell, FaQuestionCircle, FaSignOutAlt, FaArrowLeft, FaArrowRight, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/api.js";
import { jwtDecode } from "jwt-decode";
import { getUserOrders } from "../api/order.js";

export default function Dashboard() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        if (!decoded.id) return console.error("User ID not found in token");

        const userData = await AuthAPI.getUserById(decoded.id);
        setUser(userData);

        const userOrders = await getUserOrders(decoded.id);
        const completedOrders = userOrders.filter(order => order.orderStatus === "Completed");
        setOrders(completedOrders);

        const stockData = await AuthAPI.getUserStock(decoded.id);
        setStock(stockData);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    fetchUserAndOrders();
  }, []);

  const prevImage = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F1E14] text-white p-6 flex flex-col min-h-screen">
        <div className="flex items-center justify-start mt-6 mb-8 gap-4">
          {user ? (
            user.avatar ? (
              <img src={user.avatar} alt="User Avatar" className="w-14 h-14 rounded-full shadow-md" />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md text-xl">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
            )
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md">
              
            </div>
          )}
          <span className="text-2xl font-bold">🌿 KrishiSarjana</span>
        </div>

        <button className="w-full flex items-center gap-3 p-5 rounded-lg bg-[#1b3a28] hover:bg-[#21503a] text-xl" onClick={() => navigate("/customer-alert")}> <FaBell /> Alerts </button>
        <button className="w-full flex items-center gap-3 p-5 rounded-lg bg-[#1b3a28] hover:bg-[#21503a] text-xl mt-6" onClick={() => navigate("/RetailerProducts")}> <FaUpload /> Upload Products </button>

        <div className="flex-grow"></div>
        <div className="flex justify-between p-3"> <FaSignOutAlt className="text-2xl cursor-pointer hover:text-gray-300" /> <FaQuestionCircle className="text-2xl cursor-pointer hover:text-gray-300" /> </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex gap-6">
          {/* Previous Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Previous Orders</h2>
              <a href="#" className="text-sm text-gray-500 hover:underline"> See more </a>
            </div>
            <div>
              {orders.map((order, index) => (
                <div key={index} className="flex items-center justify-between border-b last:border-none py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Order ID: {order.orderId}</span>
                  </div>
                  <div className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                  <div className="text-green-700 font-bold">₹{order.totalAmount}</div>
                  <div className={`text-sm ${order.paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}`}>{order.paymentStatus}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stock Section */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Stock</h2>
              <a href="#" className="text-sm text-gray-500 hover:underline"> See more </a>
            </div>
            <div>
              {stock.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b last:border-none py-3">
                  <span className="font-medium">{item.productName}</span>
                  <div className="text-gray-500 text-sm">{item.quantity} units</div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}

const images = [
  "/path-to-image1.jpg",
  "/path-to-image2.jpg",
  "/path-to-image3.jpg"
];