import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, ShoppingBag, CreditCard, Loader2, AlertCircle } from "lucide-react";

export default function ExpenseDetails() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExpenseDetails() {
      try {
        const res = await fetch(`/api/auth/get_single_expense/${expenseId}`);
        const data = await res.json();
        
        if(data.success === false) {
          setError('Expense details not found');
          setExpense(null);
        } else {
          setExpense(data.expenseDetails);
        }
      } catch (error) {
        console.error("Error fetching expense details:", error);
        setError("Failed to fetch expense details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchExpenseDetails();
  }, [expenseId, navigate]);

  // Format date in a more detailed way
  const getFormattedDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-20 mt-16">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading expense details...</p>
      </div>
    );
  }
  
  if (!expense) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
            {error && (
              <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 border border-red-200">
                <AlertCircle className="h-6 w-6 mr-3" />
                {error}
              </div>
            )}
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
              <ShoppingBag className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Expense Not Found</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
              The expense details you're looking for could not be found.
            </p>
            <button
              onClick={() => navigate("/view_expense")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Expenses</span>
            </button>
          </div>
        </div>
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
              Expense Details
            </span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600 text-xl">
            <Calendar className="w-5 h-5 text-blue-500" />
            <p>{getFormattedDate(expense.date)}</p>
          </div>
        </div>
        
        {/* Items Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-blue-100">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2 mb-6">
            <ShoppingBag className="w-6 h-6 text-blue-500" />
            <span>Items Purchased</span>
          </h2>
          
          <div className="space-y-4">
            {expense.items.map((item, index) => (
              <div 
                key={index} 
                className={`p-5 rounded-xl flex justify-between items-center ${
                  index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                }`}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <div className="flex space-x-6">
                  <span className="text-gray-600">{item.quantity} units</span>
                  <span className="font-medium">৳{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Total Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-blue-100">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-blue-100">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xl font-medium">Total Amount</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">৳{expense.totalPrice}</span>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/view_expense")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-8 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 mx-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Expenses</span>
          </button>
        </div>
      </div>
    </div>
  );
}