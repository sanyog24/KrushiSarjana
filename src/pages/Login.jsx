import { useState } from "react";
import { AuthAPI } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTie } from "react-icons/fa";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Farmer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        response = await AuthAPI.login({
          email: formData.email,
          password: formData.password,
        });
        alert("Login Successful");
      } else {
        response = await AuthAPI.register(formData);
        alert("Registration Successful");
        setIsLogin(true);
        return;
      }

      const userRole = response.user?.role;

      if (userRole === "Farmer") {
        navigate("/farmer-dashboard");
      } else if (userRole === "Retailer") {
        navigate("/RetailerDashboard");
      } else if (userRole === "Customer") {
        navigate("/customer-dashboard");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://videos.pexels.com/video-files/4800098/4800098-sd_960_506_30fps.mp4" type="video/mp4" />
      </video>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          {isLogin ? "Welcome Back" : "Join the Krushi Sarjana"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          )}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          {!isLogin && (
            <div className="relative">
              <FaUserTie className="absolute left-3 top-3 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              >
                <option value="Farmer">Farmer</option>
                <option value="Retailer">Retailer</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-center text-sm text-gray-600 cursor-pointer hover:text-green-600 transition"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
