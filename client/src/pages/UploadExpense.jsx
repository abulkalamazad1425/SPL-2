import React, { useState, useEffect } from 'react';
import { Plus, Trash, Tag, Hash, DollarSign, ArrowRight, Receipt, AlertCircle,Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadExpense() {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ name: '', quantity: '', price: '' }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      const itemTotal = (parseFloat(item.price) || 0);
      return sum + itemTotal;
    }, 0);
    setTotalPrice(total.toFixed(2));
  }, [items]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: '', price: '' }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const res = await fetch('/api/manager/upload_expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items 
        }),
      });
      const data = await res.json();
      
      if (data.success === false) {
        setError('Failed to upload expense. Please try again.');
        return;
      }
      
      navigate('/');
    } catch (error) {
      setError('An error occurred while uploading. Please try again.');
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Upload Daily Expenses
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track and manage your mess expenses efficiently
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Items List */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-xl space-y-4 border border-blue-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-blue-600 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Item #{index + 1}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className={`p-2 rounded-full ${
                        items.length === 1 
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                          : 'text-red-500 hover:text-white hover:bg-red-500 bg-red-50'
                      } transition duration-200`}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Item Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 block">
                        Item Name
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                          type="text"
                          name="name"
                          value={item.name}
                          onChange={(e) => handleChange(index, e)}
                          placeholder="Enter item name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 block">
                        Quantity
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleChange(index, e)}
                          placeholder="Enter quantity"
                          min="0"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 block">
                        Price (&#2547;)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" >Tk </span>
                        <input
                          type="number"
                          name="price"
                          value={item.price}
                          onChange={(e) => handleChange(index, e)}
                          placeholder="Enter price"
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Item Button */}
            <button 
              type="button" 
              onClick={addItem} 
              className="w-full bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-blue-600 py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another Item</span>
            </button>
            
            {/* Total Price */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-blue-100">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xl font-medium">Total Amount</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">Tk {totalPrice}</span>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Upload Expenses</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}