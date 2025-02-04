import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Payment() {
  const { currentUser } = useSelector((state) => state.user);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser.status !== "paid") {
      fetchPendingPayments();
    }
  }, [currentUser.status]);

  const fetchPendingPayments = async () => {
    try {
      const res = await fetch(`/api/student/get_payment/${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setPendingPayments(data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Student Payment</h1>

      {currentUser.status === "paid" ? (
        <div className="p-6 bg-red-100 border border-red-400 rounded-md text-red-700">
          <p className="text-lg font-semibold">Pay Registration Fee First</p>
        </div>
      ) : loading ? (
        <p className="text-lg">Loading payments...</p>
      ) : pendingPayments.length === 0 ? (
        <p className="text-lg">No pending payments</p>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          {pendingPayments.map((payment) => (
            <div key={payment._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{payment.ref}</p>
                <p className="text-gray-600">Amount: ${payment.amount}</p>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handlePayment(payment._id)}
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
