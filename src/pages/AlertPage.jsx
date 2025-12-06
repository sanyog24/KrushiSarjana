import { useEffect, useState } from "react";
import { FaFileInvoice, FaBars, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { AuthAPI } from "../api/api.js";
import { getUserOrders, updateOrderStatus } from "../api/order.js";

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
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const decoded = jwtDecode(token);
        if (!decoded.id) throw new Error("Invalid token data.");

        const userData = await AuthAPI.getUserById(decoded.id);
        if (!userData) throw new Error("User data not found.");

        setUserId(userData._id);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        let userOrders = await getUserOrders(userId);
        userOrders = userOrders.filter(order => order.product.seller._id === userId);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleAcceptOrder = async (orderId) => {
    try {
      console.log("Attempting to update order with ID:", orderId);

      const updateData = {
        orderStatus: "Completed",
        paymentStatus: "Paid",
      };

      console.log("Sending update data:", JSON.stringify(updateData));

      const response = await updateOrderStatus(orderId, updateData);

      console.log("Server response:", response);

      if (response && response.order) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: "Completed", paymentStatus: "Paid" }
              : order
          )
        );
        console.log("Order successfully updated in state.");
      } else {
        throw new Error("Order update failed.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "pending") return order.orderStatus === "Pending";
    if (filter === "completed") return order.orderStatus === "Completed";
    return true;
  });

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <button
        className="md:hidden p-4 text-white bg-[#0F1E14]"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars />
      </button>

      <aside
        className={`fixed md:relative top-0 left-0 w-64 bg-[#0F1E14] p-4 text-white min-h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col`}
      >
        <button
          className="md:hidden text-white text-2xl mb-4"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes />
        </button>

        <h2 className="font-semibold mb-6">KrishiSarjana</h2>
        <button className="w-full p-3 rounded-lg bg-[#1b3a28] hover:bg-[#21503a]" onClick={() => setFilter("all")}>
          Orders
        </button>
        <button className="w-full p-3 rounded-lg bg-[#1b3a28] hover:bg-[#21503a] mt-2" onClick={() => setFilter("pending")}>
          Pending Orders
        </button>
        <button className="w-full p-3 rounded-lg bg-[#1b3a28] hover:bg-[#21503a] mt-2" onClick={() => setFilter("completed")}>
          Completed Orders
        </button>
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
                <div className="flex justify-center">
                  <img src={order.product.image} alt={order.product.name} className="w-24 h-24 object-cover rounded-full mb-3" />
                </div>

                <h3 className="text-lg font-semibold text-center">{order.product.name}</h3>
                <p className="text-gray-700 text-center">
                  Price: <span className="font-bold">₹{order.product.price}</span>
                </p>

                <p className="text-gray-700 text-center">Ordered By: {order.buyer.name} ({order.buyer.role})</p>

                <div className="flex gap-3 mt-4">
                  {order.orderStatus === "Pending" && (
                    <>
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg" onClick={() => handleAcceptOrder(order._id)}>
                        Accept
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg">
                        Reject
                      </button>
                    </>
                  )}
                  {order.orderStatus === "Completed" && <p className="text-green-600 font-bold text-center">Completed</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
