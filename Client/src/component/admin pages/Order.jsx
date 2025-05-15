import React, { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5174/api/membership/getAllProductOrders")
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus, userId) => {
    try {
      await axios.put(`http://localhost:5174/api/membership/updateOrderinfo/${orderId}`, {
        deliveryStatus: newStatus,
        userId,
      });
  
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, deliveryStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    }
  };
  
  

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
    <h2 className="text-3xl font-bold mb-8 text-center sm:text-left">🛒 Product Orders</h2>
  
    {loading ? (
      <p className="text-gray-400 text-center">Loading orders...</p>
    ) : orders.length === 0 ? (
      <p className="text-gray-400 text-center">No orders found.</p>
    ) : (
      <div className="overflow-x-auto bg-gray-950 rounded-xl border border-gray-800 shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="py-3 px-4 text-left whitespace-nowrap">User ID</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Order ID</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Items</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Amount</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Payment</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Delivery</th>
              <th className="py-3 px-4 text-left whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-800 transition duration-300">
                <td className="py-3 px-4 break-all">{order.userId}</td>
                <td className="py-3 px-4 break-all">{order.razorpayOrderId}</td>
                <td className="py-3 px-4">
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-gray-200">
                        <span className="font-semibold text-indigo-400">{item.product?.name || "Unknown"}</span>{" "}
                        <span className="text-gray-400">(x{item.quantity})</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4 font-semibold text-indigo-400">₹{order.amount}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "success"
                        ? "bg-green-600 text-white"
                        : order.status === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    className="bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={order.deliveryStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value, order.userId)
                    }
                  >
                    <option>Order Placed</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  
  );
};

export default Order;
