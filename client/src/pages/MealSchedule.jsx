import React, { useState } from 'react';
import { Calendar, DollarSign, List, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MealSchedule() {
  // State to hold form data
  const navigate=useNavigate(); 
  const [formData, setFormData] = useState({
    startDate: '',
    finishDate: '',
    mealChoice: '',
    mealRate: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update the specific field in the form data
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res=await fetch('/api/manager/update_mealschedule',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    })
    const data=res.json();
    if(data.success===false){
      console.log(data.message);
    }
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Meal Form</h1>
            <p className="text-gray-500">Plan your meals efficiently</p>
          </div>

          {/* Form Section */}
          <form id="mealForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Start Date */}
              <div className="relative">
                <label htmlFor="startDate" className="text-sm font-medium text-gray-700 block mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>

              {/* Finish Date */}
              <div className="relative">
                <label htmlFor="finishDate" className="text-sm font-medium text-gray-700 block mb-2">
                  Finish Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    id="finishDate"
                    name="finishDate"
                    value={formData.finishDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>

              {/* Meal Choice Type */}
              <div className="relative">
                <label htmlFor="type" className="text-sm font-medium text-gray-700 block mb-2">
                  Meal Choice Type
                </label>
                <div className="relative">
                  <List className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="mealChoice"
                    name="mealChoice"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">--Select Meal Choice Type--</option>
                    <option value="day">Day</option>
                    <option value="period">Period</option>
                  </select>
                </div>
              </div>

              {/* Meal Rate */}
              <div className="relative">
                <label htmlFor="mealRate" className="text-sm font-medium text-gray-700 block mb-2">
                  Meal Rate
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    id="mealRate"
                    name="mealRate"
                    step="0.01"
                    min="0"
                    value={formData.mealRate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>Submit</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
