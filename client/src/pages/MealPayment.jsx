import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CreditCard, DollarSign, User } from "lucide-react";

export default function MealPayment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [regNo, setRegNo] = useState("");

  useEffect(() => {
    async function fetchMealPayments() {
      try {
        const res = await fetch("/api/manager/get_meal_payment");
        const data = await res.json();
        if (data.success === false) {
          setError("Problem in fetching payments");
          setPayments([]);
        } else {
          setPayments(data);
        }
      } catch (error) {
        console.error("Error fetching meal payments:", error);
        setError("Failed to fetch payments. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchMealPayments();
  }, []);

  const handleUpdatePayment = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handleProceedPayment = async () => {
    if (!regNo) {
      setError("Please enter a registration number");
      return;
    }
    try {
      const res = await fetch(`/api/manager/update_meal_payment/${selectedPayment}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg_no: regNo }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError("Failed to update meal payment");
        return;
      }
      // Show success message and reset state
      alert("Meal payment updated successfully");
      setSelectedPayment(null);
      setRegNo("");
      // Refresh payment list
      const updatedRes = await fetch("/api/manager/get_meal_payment");
      const updatedData = await updatedRes.json();
      if (updatedData.success !== false) {
        setPayments(updatedData);
      }
    } catch (error) {
      console.error("Error updating meal payment:", error);
      setError("An error occurred while updating payment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Upcoming Meal Payments
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and process student meal payments
          </p>
        </div>

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
            {payments.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <CreditCard className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Payments Found</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no upcoming meal payments to process at this time.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-left">
                        <th className="py-4 px-4 rounded-l-xl">Reference</th>
                        <th className="py-4 px-4">Amount</th>
                        <th className="py-4 px-4">Type</th>
                        <th className="py-4 px-4 rounded-r-xl text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => (
                        <tr 
                          key={payment._id} 
                          className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-blue-100 mr-3">
                                <CreditCard className="h-4 w-4 text-blue-500" />
                              </div>
                              <span className="font-medium">{payment.ref}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span>Tk {payment.amount}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                              {payment.paymentType}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleUpdatePayment(payment._id)}
                              className="px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                            >
                              Update Payment
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Enter Student Registration
            </h3>
            
            <div className="mb-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Registration Number"
                />
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={handleProceedPayment}
              >
                Proceed
              </button>
              <button
                className="px-6 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 bg-gray-200 hover:bg-gray-300"
                onClick={() => setSelectedPayment(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}