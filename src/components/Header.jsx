import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import UserMenu from "./UserMenu.jsx";
import Divider from "./Divider.jsx";
import { AuthAPI } from "../api/api.js";

const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItem, setCartItem] = useState([]);
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(["Welcome to Krushi Sarjana!"]);
  const [coins, setCoins] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from token
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        if (!decoded.id) {
          console.error("User ID not found in token");
          return;
        }

        const userData = await AuthAPI.getUserById(decoded.id);
        setUser(userData);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    };

    fetchUser();
  }, [user]);

  useEffect(() => {
    // Fetch stored coins from localStorage
    const storedCoins = localStorage.getItem("coins");
    if (storedCoins) {
      setCoins(parseInt(storedCoins));
    }

    // Listen for storage updates
    const handleStorageChange = (event) => {
      if (event.key === "coins") {
        const updatedCoins = localStorage.getItem("coins");
        setCoins(parseInt(updatedCoins) || 0);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleOrderPlacement = (paymentMethod) => {
    const notificationMessage = user?.role === "farmer" ? "Order Received" : "Order Completed";
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      `Payment Method: ${paymentMethod} - ${notificationMessage}`,
    ]);
  };

  return (
    <header className="bg-white shadow-md py-4 px-16">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo and Heading */}
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <img src="/images/krushilogo.png" alt="" className="h-10 mr-3" />
            <Link to="/">
              <h1 className="text-2xl font-bold text-green-600 whitespace-nowrap">
                Krishi Sarjana
              </h1>
            </Link>
          </div>
        </div>

        {/* Coins Section */}
        {user && (
  <div className="flex items-center space-x-2 p-2 bg-yellow-200 rounded-lg shadow-md w-24">
    <span className="text-2xl">🪙</span>
    <span className="text-lg font-bold">{coins}</span>
  </div>
)}
        {/* Account, Notifications, and Kinesis */}
        <div className="flex items-center gap-6">
          {/* Account/Login */}
          {user?._id ? (
            <div className="relative">
              <div onClick={() => setOpenUserMenu((prev) => !prev)} className="flex items-center gap-1 cursor-pointer">
                <p>Account</p>
                {openUserMenu ? <GoTriangleUp size={25} /> : <GoTriangleDown size={25} />}
              </div>
              {openUserMenu && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg z-50 w-48">
                  <UserMenu close={() => setOpenUserMenu(false)} user={user} />
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="text-lg px-2">
              Login
            </button>
          )}

          {/* Notifications */}
          <button onClick={toggleDropdown} className="text-xl relative z-50 mr-4">
            <IoMdNotificationsOutline size={30} />
          </button>

          {/* Notification Dropdown */}
          {isOpen && (
            <div className="absolute right-0 w-64 mt-2 bg-white border rounded-lg shadow-lg p-4 z-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <button onClick={clearNotifications} className="text-sm text-red-500">
                  <AiOutlineClose />
                </button>
              </div>
              <div className="mt-2">
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No notifications</p>
                ) : (
                  notifications.map((notification, index) => (
                    <div key={index} className="border-b py-2 text-sm text-gray-700">
                      {notification}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Kinesis Label */}
          <p className="ml-auto">Kinesis</p>
        </div>
      </div>
    </header>
  );
};

export default Header;