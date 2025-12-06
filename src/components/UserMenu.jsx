import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExternalLink, HiOutlineLogout } from "react-icons/hi";
import { AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import { FiPackage, FiShoppingCart, FiUpload, FiLayers } from "react-icons/fi";
import { AuthAPI } from "../api/api.js";
import { jwtDecode } from "jwt-decode";

const UserMenu = ({ close }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await AuthAPI.logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      alert(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64">
      {!user ? (
        <div className="text-sm text-center">
          <Link
            onClick={handleClose}
            to="/login"
            className="block bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Login
          </Link>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex items-center space-x-3 pb-3 border-b">
            {/* Avatar */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full shadow-md"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-md">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </div>
            )}

            {/* User Info */}
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {user.name || user.email}
              </div>
              {user.role === "ADMIN" && (
                <span className="text-sm text-red-500">Admin</span>
              )}
            </div>

            {/* Profile Link */}
            <Link
              onClick={handleClose}
              to={"/dashboard/farmer-profile"}
              className="text-gray-500 hover:text-blue-600"
            >
              <HiOutlineExternalLink size={18} />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="mt-3 space-y-2 text-sm">
            {/* Common for All */}

            {user.role === "Customer" && (
              <>
                <Link
                  onClick={handleClose}
                  to={"/customer-dashboard"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <AiOutlineDashboard
                    className="mr-2 text-blue-500"
                    size={18}
                  />
                  Dashboard
                </Link>

                <Link
                  onClick={handleClose}
                  to={"/dashboard/customer-profile"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <AiOutlineUser className="mr-2 text-green-500" size={18} />
                  Profile
                </Link>
              </>
            )}

            {/* Role-Based Navigation */}
            {user.role === "Farmer" && (
              <>
                <Link
                  onClick={handleClose}
                  to={"/farmer-dashboard"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <AiOutlineDashboard
                    className="mr-2 text-blue-500"
                    size={18}
                  />
                  Dashboard
                </Link>

                <Link
                  onClick={handleClose}
                  to={"/dashboard/farmer-profile"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <AiOutlineUser className="mr-2 text-green-500" size={18} />
                  Profile
                </Link>
                {/* <Link
                  onClick={handleClose}
                  to={"/dashboard/category"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <FiLayers className="mr-2 text-orange-500" size={18} />
                  Category
                </Link> */}
                <Link
                  onClick={handleClose}
                  to={"/dashboard/upload-product"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <FiUpload className="mr-2 text-purple-500" size={18} />
                  Upload Product
                </Link>
                {/* <Link
                  onClick={handleClose}
                  to={"/dashboard/product"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <FiPackage className="mr-2 text-yellow-500" size={18} />
                  Product
                </Link> */}
                {/* <Link
                  onClick={handleClose}
                  to={"/dashboard/farmers-growth-fund"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  🌱 Farmers Growth Fund
                </Link> */}
              </>
            )}

            {user.role === "Retailer" && (
              <>
                <Link
                  onClick={handleClose}
                  to={"/RetailerDashboard"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <AiOutlineDashboard
                    className="mr-2 text-blue-500"
                    size={18}
                  />
                  Dashboard
                </Link>

                <Link
                  onClick={handleClose}
                  to={"/dashboard/retailer-profile"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <AiOutlineUser className="mr-2 text-green-500" size={18} />
                  Profile
                </Link>
                {/* <Link
                  onClick={handleClose}
                  to={"/dashboard/upload-category"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <FiLayers className="mr-2 text-orange-500" size={18} />
                  Category
                </Link> */}
                <Link
                  onClick={handleClose}
                  to={"/dashboard/upload-product"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <FiUpload className="mr-2 text-purple-500" size={18} />
                  Upload Product
                </Link>
                {/* <Link
                  onClick={handleClose}
                  to={"/dashboard/product"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <FiPackage className="mr-2 text-yellow-500" size={18} />
                  Products
                </Link> */}
                <Link
                  onClick={handleClose}
                  to={"/dashboard/orders"}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <FiShoppingCart className="mr-2 text-red-500" size={18} />
                  Orders
                </Link>
              </>
            )}

            {/* Other Links */}
            <Link
              onClick={handleClose}
              to={"https://cropcartdelivery.vercel.app/"}
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
            >
              🚚 Track Delivery
            </Link>
            {/* <Link
              onClick={handleClose}
              to={"/dashboard/address"}
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
            >
              📍 Save Address
            </Link> */}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 mt-3 text-red-600 bg-gray-50 rounded-md hover:bg-red-100"
          >
            <HiOutlineLogout className="mr-2" size={18} />
            Log Out
          </button>
        </>
      )}
    </div>
  );
};

export default UserMenu;
