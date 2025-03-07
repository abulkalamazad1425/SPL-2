import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, DollarSign, Loader2, AlertCircle } from "lucide-react";
import TakaIcon from "../components/TakaIcon";

export default function Expense() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch("/api/auth/get_all_expense");
        const data = await res.json();
        if(data.success === false) {
          setError('Expense list not found');
          setExpenses([]);
        } else {
          setExpenses(data.expenseList);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  // Function to format currency
  const formatCurrency = (amount) => {
    return `৳${amount}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-20 mt-16">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Expenses
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View your complete expense history
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
          {expenses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                <DollarSign className="h-12 w-12 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">No Expenses Found</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                There are no expenses available in your history.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div
                  key={expense._id}
                  className={`p-5 rounded-xl flex justify-between items-center hover:bg-blue-50 cursor-pointer transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                  }`}
                  onClick={() => navigate(`/view_expense_details/${expense._id}`)}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="font-medium">{new Date(expense.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <TakaIcon color="rgb(107,114,128)" />
                      <span className="font-bold text-blue-600">{formatCurrency(expense.totalPrice)}</span>
                    </div>
                    <div className="bg-blue-100 rounded-full p-2 hover:bg-blue-200 transition-colors">
                      <ArrowRight className="h-4 w-4 text-blue-500 hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}