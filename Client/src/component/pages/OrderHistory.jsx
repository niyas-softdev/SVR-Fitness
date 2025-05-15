import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { motion } from "framer-motion";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const res = await axios.get(`/api/payments/order-history/${userId}`);
        const allOrders = Array.isArray(res.data.data) ? res.data.data : [];
        const successOrders = allOrders.filter(order => order.status === "success");

        const ordersWithDetails = await Promise.all(
          successOrders.map(async (order) => {
            const updatedItems = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const productRes = await axios.get(`/api/product/get/${item.productId}`);
                  return { ...item, productDetails: productRes.data.data };
                } catch {
                  return {
                    ...item,
                    productDetails: {
                      name: "Unknown Product",
                      price: 0,
                      imageUrl: "/placeholder.jpg",
                    },
                  };
                }
              })
            );
            return { ...order, items: updatedItems };
          })
        );

        setOrders(ordersWithDetails);
      } catch (err) {
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrderHistory();
  }, [userId]);

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("VR Fitness - Invoice", 14, 20);
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.razorpayOrderId}`, 14, 30);
    doc.text(`Purchase Date: ${new Date(order.purchasedAt || order.createdAt).toLocaleString()}`, 14, 36);
    doc.text(`Status: ${order.status}`, 14, 42);
    doc.text(`Amount Paid: ₹${(order.amount / 100).toFixed(2)}`, 14, 48);

    const rows = order.items.map(item => [
      item.productDetails.name,
      item.quantity,
      `₹${item.productDetails.price}`,
      `₹${(item.productDetails.price * item.quantity).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 55,
      head: [["Product", "Qty", "Unit Price", "Total"]],
      body: rows,
    });

    doc.save(`Invoice_${order.razorpayOrderId}.pdf`);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading your order history...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6 text-center text-gray-400">No successful orders yet.</div>;
  }

  return (
    <motion.div
      className="p-4 sm:p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-10">Order History</h1>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-700 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-300 font-medium">
                  <span className="font-semibold">Order ID:</span> {order.razorpayOrderId}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === "success"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Date:</span> {new Date(order.purchasedAt || order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-sm font-semibold text-white mt-3 sm:mt-0 sm:text-right space-y-1">
                <p>Total: ₹{(order.amount / 100).toFixed(2)}</p>
                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-white">Delivery:</span> <span className="text-indigo-400 font-medium">{order.deliveryStatus}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item, idx) => {
                const product = item.productDetails;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-800 rounded-xl p-3"
                  >
                    <img
                      src={product?.imageUrl || "/placeholder.jpg"}
                      alt={product?.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-white">{product?.name}</p>
                      <p className="text-sm text-gray-400">Qty: {item.quantity} | ₹{product?.price} each</p>
                    </div>
                    <div className="text-right text-white font-bold">
                      ₹{(product?.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

           
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderHistory;
