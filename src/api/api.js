import axios from "axios";

// Base API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Ensures cookies (tokens) are sent with requests
});

// Function to set or remove token from headers
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  }
};

// **Authentication APIs**
const AuthAPI = {
  register: async (userData) => {
    try {
      const { data } = await API.post("/auth/register", userData);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  },

  login: async (credentials) => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      setAuthToken(data.token);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  logout: async () => {
    try {
      await API.post("/auth/logout");
      setAuthToken(null);
      return { message: "Logged out successfully" };
    } catch (error) {
      throw error.response?.data?.message || "Logout failed";
    }
  },

  getUserById: async (id) => {
    try {
      // console.log("Fetching user with ID:", id); // Debugging
      const { data } = await API.get(`/auth/user/${id}`);
      // console.log("Fetched user data:", data); // Debugging
      return data;
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error.message);
      return null;
    }
  },
};

// **Exporting API**
export { API, AuthAPI };
