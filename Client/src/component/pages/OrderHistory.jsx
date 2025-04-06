import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // ✅ attaches autoTable to jsPDF prototype

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
      className="p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-bold text-center text-white mb-10">Order History</h1>

      <div className="space-y-8">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-semibold">Order ID:</span> {order.razorpayOrderId}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <span className="font-semibold">Status:</span> {order.status}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.purchasedAt || order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-sm text-gray-800 font-semibold mt-2 sm:mt-0 sm:text-right">
                Amount: ₹{(order.amount / 100).toFixed(2)}
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item, idx) => {
                const product = item.productDetails;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:shadow transition"
                  >
                    <img
                      src={product?.imageUrl || "/placeholder.jpg"}
                      alt={product?.name}
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-800">{product?.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        Unit Price: ₹{product?.price?.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-gray-700">
                      ₹{(product?.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => generateInvoice(order)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
              >
                Download Invoice
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderHistory;
