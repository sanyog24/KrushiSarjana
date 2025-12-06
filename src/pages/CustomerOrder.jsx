import { useEffect, useState } from "react";
import { FaFileInvoice, FaStar, FaBars, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { AuthAPI } from "../api/api.js";
import { getUserOrders, cancelOrder } from "../api/order.js";
import GiveRatings from "./GiveRatings.jsx";

export default function MyOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        if (!decoded.id) return;

        const userData = await AuthAPI.getUserById(decoded.id);
        if (!userData) return;

        console.log("User data fetched:", userData);
        setUserId(userData._id);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        console.log("Fetching user orders...");
        setLoading(true);
        const userOrders = await getUserOrders(userId);
        console.log("Orders fetched:", userOrders);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      console.log(`Cancelling order with ID: ${orderId}`);
      const response = await cancelOrder(orderId);
  
      console.log("Order cancellation response:", response);
  
      alert(response.message); // Show success message
  
      // ✅ Update the state to remove the deleted order
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
  
    } catch (error) {
      console.error("Failed to cancel order:", error.message || error);
      
      alert(`Failed to cancel order: ${error.response?.data?.message || error.message}`);
    }
  };
  
    

  const filteredOrders = orders.filter(order => {
    if (filter === "pending") return order.orderStatus === "Pending";
    if (filter === "completed") return order.orderStatus === "Completed";
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <button className="md:hidden p-4 text-white bg-[#0F1E14]" onClick={() => setIsSidebarOpen(true)}>
        <FaBars />
      </button>

      <aside className={`fixed md:relative top-0 left-0 w-64 bg-[#0F1E14] p-4 text-white min-h-screen transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex md:flex-col`}>
        <button className="md:hidden text-white text-2xl mb-4" onClick={() => setIsSidebarOpen(false)}>
          <FaTimes />
        </button>

        <h2 className="font-semibold mb-6">KrishiSarjana</h2>
        <button className="w-full p-3 rounded-lg bg-[#1b3a28] hover:bg-[#21503a]" onClick={() => setFilter("all")}>Orders</button>
        <button className="w-full p-3 rounded-lg bg-[#1b3a28] hover:bg-[#21503a] mt-2" onClick={() => setFilter("pending")}>Pending Orders</button>
        <button className="w-full p-3 rounded-lg bg-[#1b3a28] hover:bg-[#21503a] mt-2" onClick={() => setFilter("completed")}>Completed Orders</button>
      </aside>

      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">My Orders</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-6 bg-white rounded-lg shadow-md border">
                <img src={order.product.image} alt={order.product.name} className="w-full h-40 object-cover rounded-md mb-3" />
                <h3 className="text-lg font-semibold">{order.product.name}</h3>
                <p className="text-gray-700">Order ID: {order.orderId}</p>
                <p className="text-gray-700">Payment ID: {order.paymentId}</p>
                <p className="text-gray-700">Buyer: {order.buyer.name} ({order.buyer.role})</p>
                <p className="text-gray-700">Subtotal: ₹{order.subTotalAmount}</p>
                <p className="text-gray-700">Total: ₹{order.totalAmount}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-3 py-1 text-xs rounded-full ${order.orderStatus === "Pending" ? "bg-orange-100 text-orange-500" : "bg-green-100 text-green-600"}`}>{order.orderStatus}</span>
                  <span className={`px-3 py-1 text-xs rounded-full ${order.paymentStatus === "Pending" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>{order.paymentStatus}</span>
                  <FaFileInvoice className="text-gray-600" />
                </div>
                {order.orderStatus === "Completed" ? (
                  <GiveRatings userId={userId} productId={order.product._id} />
                ) : (
                  <button onClick={() => handleCancelOrder(order._id)} className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg">
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
