import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from "../../assets/vr Fitness transparent Gym Logo.png";

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart);
  const userId = localStorage.getItem('userId');

  const formatRupees = (amountInPaise) => `₹${(amountInPaise / 100).toFixed(2)}`;

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
  });

  const [razorAmount, setRazorAmount] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5174/api/profile/get/${userId}`, {
          headers: { userid: userId },
        });
        if (response.data.success && response.data.data) {
          const user = response.data.data;
          setForm({
            fullName: user.name || '',
            phone: user.phoneNumber || '',
            address: user.address || '',
            paymentMethod: 'COD',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId) fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.address || !form.phone) {
      alert("Please fill all the details");
      return;
    }

    if (!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }

    const items = cart.items.map((item) => ({
      productId: item._id,
      quantity: item.cartQuantity,
    }));

    // ✅ COD Flow
    if (form.paymentMethod === "COD") {
      try {
        await axios.post("http://localhost:5174/api/orders/place", {
          userId,
          items,
          paymentMethod: "COD",
          customerDetails: form,
          purchasedAt: new Date(), // ✅ Add custom field here as well
        });
        window.location.href = "/order-success";
      } catch (err) {
        console.error("COD order failed", err);
        alert("Order placement failed");
      }
      return;
    }

    // ✅ Razorpay Flow
    try {
      const loadRazorpayScript = async () => {
        return new Promise((resolve) => {
          if (window.Razorpay) return resolve(true);
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Try again.");
        return;
      }

      const { data } = await axios.post("http://localhost:5174/api/payments/create-order", {
        userId,
        items,
      });

      const { orderId, amount } = data;
      if (!orderId) throw new Error("No orderId received");

      setRazorAmount(amount);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "VR Fitness",
        description: "Order Payment",
        image: logo,
        order_id: orderId,
        handler: async function (response) {
          await axios.post("http://localhost:5174/api/payments/confirm-payment", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            items,
            customerDetails: form,
            purchasedAt: new Date(), // ✅ Store the purchase date
          });
          window.location.href = "/orderHistory";
        },
        prefill: {
          name: form.fullName,
          email: "guest@example.com",
          contact: form.phone,
        },
        theme: { color: "#1e293b" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6"
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        Checkout
      </motion.h1>

      <div className="grid gap-6 max-w-2xl mx-auto mb-12">
        <motion.input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-4 rounded-lg bg-gray-700 text-white shadow-md"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-4 rounded-lg bg-gray-700 text-white shadow-md"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-4 rounded-lg bg-gray-700 text-white shadow-md"
          rows="3"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="p-4 rounded-lg bg-gray-700 text-white shadow-md"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Card">Online payment</option>
        </motion.select>
      </div>

      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cart.items.length > 0 ? (
          <div className="grid gap-4">
            {cart.items.map((item) => (
              <motion.div
                key={item._id}
                className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md"
                whileHover={{ scale: 1.01 }}
              >
                <img
                  src={item.imageUrl || "/placeholder-image.png"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400">Quantity: {item.cartQuantity}</p>
                  <p className="text-sm text-gray-400">
                    Price: ₹{item.price.toFixed(2)} × {item.cartQuantity}
                  </p>
                </div>
                <div className="text-right font-bold text-white text-lg">
                  ₹{(item.price * item.cartQuantity).toFixed(2)}
                </div>
              </motion.div>
            ))}
            <div className="flex justify-between mt-6 font-bold text-lg border-t border-gray-700 pt-4">
              <span>Total:</span>
              <span>₹{cart.subtotal.toFixed(2)}</span>
            </div>
            {razorAmount && (
              <div className="flex justify-between font-medium text-base text-gray-300 mt-2">
                <span>Razorpay Amount:</span>
                <span>{formatRupees(razorAmount)}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Your cart is empty.</p>
        )}
      </motion.div>

      <motion.button
        onClick={handlePlaceOrder}
        className="w-40 mt-10 mx-auto block bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-white font-medium text-base shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {form.paymentMethod === "COD" ? "Confirm" : "Pay"}
      </motion.button>
    </motion.div>
  );
};

export default CheckoutPage;
