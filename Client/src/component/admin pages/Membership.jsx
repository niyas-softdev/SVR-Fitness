import React, { useEffect, useState } from "react";
import axios from "axios";

const Membership = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5174/api/membership/getAllPayments")
      .then((res) => {
        if (res.data.success) {
          setPayments(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching payments:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-white">
    <h2 className="text-2xl sm:text-3xl font-bold mb-6">Membership Payments</h2>
  
    {loading ? (
      <p className="text-gray-400">Loading payments...</p>
    ) : payments.length === 0 ? (
      <p className="text-gray-400">No payments found.</p>
    ) : (
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] sm:min-w-full text-sm bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Plan</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-gray-800">
                <td className="py-2 px-4">{p.user?.name || "N/A"}</td>
                <td className="py-2 px-4">{p.user?.email || "N/A"}</td>
                <td className="py-2 px-4">{p.membershipPlan?.name}</td>
                <td className="py-2 px-4">₹{p.membershipPlan?.price}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.paymentStatus === "completed"
                        ? "bg-green-600 text-white"
                        : p.paymentStatus === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {p.paymentStatus}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {new Date(p.createdAt).toLocaleDateString()}
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

export default Membership;
