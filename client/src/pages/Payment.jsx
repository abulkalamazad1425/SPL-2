import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2, AlertCircle, CreditCard, DollarSign, ArrowRight } from "lucide-react";

export default function Payment() {
  const { currentUser } = useSelector((state) => state.user);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser.reg_payment === "paid") {
      fetchPendingPayments();
    }
  }, [currentUser.reg_payment]);

  const fetchPendingPayments = async () => {
    try {
      const res = await fetch(`/api/student/get_payment/${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setPendingPayments(data);
      } else {
        setError(data.message || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments. Please try again.");
    }
    setLoading(false);
  };

  const handlePayment = async (payment_id) => {
    try {
      const res = await fetch(`/api/student/make_payment?paymentId=${payment_id}&studentId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        window.open(data.url, '_blank');
      } else {
        setError(data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error making payment:", error);
      setError("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Student Payment Portal
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and process your pending payments
          </p>
        </div>

        {/* Registration Fee Warning */}
        {!currentUser.reg_payment === "paid" && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            Please pay your registration fee first before accessing other payment options.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center p-20">
            <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading payments...</p>
          </div>
        ) : (
          <>
            {currentUser.reg_payment === "paid" && pendingPayments.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <CreditCard className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Pending Payments</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  You don't have any pending payments at this time.
                </p>
              </div>
            ) : (
              currentUser.reg_payment === "paid" && (
                <div className="grid grid-cols-1 gap-6">
                  {pendingPayments.map((payment) => (
                    <div key={payment._id} className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-100 mr-4">
                            <CreditCard className="h-6 w-6 text-blue-500" />
                          </div>
                          <div>
                            <h3 className=" font-semibold text-gray-800">{payment.ref}</h3>
                            <div className="flex items-center gap-1 mt-1">
                               <span>Tk </span>
                              <span className="text-lg font-medium text-blue-600"> {payment.amount}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handlePayment(payment._id)}
                          className="px-5 py-3 rounded-xl text-white font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center"
                        >
                          Pay Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}