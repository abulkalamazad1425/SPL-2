import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, ShoppingBag, CreditCard, Loader2, AlertCircle, Package } from "lucide-react";

export default function ExpenseDetails() {
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExpenseDetails() {
      try {
        const res = await fetch(`/api/expense/get_single_expense/${expenseId}`);
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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-20">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading expense details...</p>
      </div>
    );
  }
  
  if (!expense) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-blue-100">
            {error && (
              <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-base flex items-center mb-4 border border-red-200">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              <ShoppingBag className="h-10 w-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Expense Not Found</h2>
            <p className="text-base text-gray-600 max-w-xs mx-auto mb-5">
              The expense details you're looking for could not be found.
            </p>
            <button
              onClick={() => navigate("/view_expense")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Expenses</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 mb-6 text-center shadow-lg border border-blue-100">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Expense Details
            </span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600 text-lg">
            <Calendar className="w-4 h-4 text-blue-500" />
            <p>{getFormattedDate(expense.date)}</p>
          </div>
        </div>
        
        {/* Items Section */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <span>Items Purchased</span>
          </h2>
          
          <div className="space-y-3">
            {expense.items.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl flex flex-row justify-between ${
                  index % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gradient-to-r from-pink-50 to-indigo-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-2">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 mx-2">
                    <Package className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-purple-700 font-medium text-sm">{item.quantity} units</span>
                </div>
                
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-pink-100 mr-2">
                    <CreditCard className="h-4 w-4 text-pink-500" />
                  </div>
                  <span className="font-medium text-pink-700 text-sm">BDT {item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Total Section */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-blue-100">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-medium text-gray-800">Total Amount</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl shadow-sm">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">BDT {expense.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/view_expense")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-6 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Expenses</span>
          </button>
        </div>
      </div>
    </div>
  );
}