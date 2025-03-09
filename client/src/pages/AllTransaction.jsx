import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, DollarSign, Calendar, User, CreditCard, Hash } from "lucide-react";

export default function AllTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/payment/all_transaction");
        const data = await res.json();
        if (data.success === false) {
          setError("Failed to fetch transactions. Please try again.");
          return;
        }
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("An error occurred while fetching transactions.");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              All Transactions
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all financial transactions in the system
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
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading transactions...</p>
          </div>
        ) : (
          <>
            {transactions.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <DollarSign className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Transactions Found</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no financial transactions recorded in the system.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-left">
                        <th className="py-4 px-4 rounded-l-xl">Date</th>
                        <th className="py-4 px-4">Name</th>
                        <th className="py-4 px-4">Reg No</th>
                        <th className="py-4 px-4">Amount</th>
                        <th className="py-4 px-4">Payment Type</th>
                        <th className="py-4 px-4 rounded-r-xl">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr
                          key={transaction._id}
                          className={`border-t hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-blue-100 mr-3">
                                <Calendar className="h-4 w-4 text-blue-500" />
                              </div>
                              <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-purple-100 mr-3">
                                <User className="h-4 w-4 text-purple-500" />
                              </div>
                              <span className="font-medium">{transaction.studentRef?.name || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{transaction.studentRef?.reg_no || "N/A"}</td>
                          <td className="py-3 px-4 font-medium">
                            <div className="flex items-center">
                              <span>Tk {transaction.paymentRef?.amount || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{transaction.paymentRef?.paymentType || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Hash className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-gray-600">{transaction.paymentRef?.ref || "N/A"}</span>
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