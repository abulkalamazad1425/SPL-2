import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  Search 
} from "lucide-react";

export default function PaymentHistory() {
  const { studentId } = useParams();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPaymentHistory() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/student/payment_history/${studentId}`);
        const data = await res.json();
        if (data.success) {
          setPayments(data.paymentHistory);
          setFilteredPayments(data.paymentHistory);
        } else {
          setError(data.message || "Failed to fetch payment history");
          setPayments([]);
          setFilteredPayments([]);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setError("Failed to fetch payment history. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchPaymentHistory();
  }, [studentId]);

  // Filter function based on date or reference
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredPayments(payments); // Reset list if empty
    } else {
      const filtered = payments.filter((payment) =>
        new Date(payment.date).toLocaleDateString().includes(query) ||
        (payment.paymentRef.ref && payment.paymentRef.ref.includes(query))
      );
      setFilteredPayments(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Payment History
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your complete record of transactions
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-md border border-blue-100">
          <div className="flex items-center w-full">
            <label htmlFor="searchPayment" className="font-medium text-gray-700 mr-3">
              Find Payment:
            </label>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
              <input
                type="text"
                id="searchPayment"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by date or reference..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
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
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading payment history...</p>
          </div>
        ) : (
          <>
            {filteredPayments.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <DollarSign className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Payment History</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  You have no recorded transactions at the moment.
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
                        <th className="py-4 px-4">Payment Type</th>
                        <th className="py-4 px-4 rounded-r-xl">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment, index) => (
                        <tr 
                          key={payment._id} 
                          className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                              <span>{payment.paymentRef.ref || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-green-700">Tk</span>
                              <span className="font-medium text-blue-600">
                                {payment.paymentRef.amount}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              payment.paymentRef.paymentType === 'mealPayment'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {payment.paymentRef.paymentType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{new Date(payment.date).toLocaleDateString()}</span>
                            </div>
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
    </div>
  );
}