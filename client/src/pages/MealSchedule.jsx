import React, { useState } from 'react';
import { Calendar, DollarSign, List, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MealSchedule() {
  // State to hold form data
  const navigate = useNavigate(); 
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
    const res = await fetch('/api/manager/update_mealschedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      console.log(data.message);
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Meal Schedule
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Set up meal schedules and rates for hostel residents
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <form id="mealForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Start Date */}
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700 block">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
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
            <div className="space-y-2">
              <label htmlFor="finishDate" className="text-sm font-medium text-gray-700 block">
                Finish Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
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
            <div className="space-y-2">
              <label htmlFor="mealChoice" className="text-sm font-medium text-gray-700 block">
                Meal Choice Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <List className="h-5 w-5 text-purple-500" />
                </div>
                <select
                  id="mealChoice"
                  name="mealChoice"
                  value={formData.mealChoice}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value="">--Select Meal Choice Type--</option>
                  <option value="Single Choice">Single Choice</option>
                  <option value="Double Choice">Double Choice</option>
                </select>
              </div>
            </div>

            {/* Meal Rate */}
            <div className="space-y-2">
              <label htmlFor="mealRate" className="text-sm font-medium text-gray-700 block">
                Meal Rate
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  Tk
                </div>
                <input
                  type="number"
                  id="mealRate"
                  name="mealRate"
                  min="0"
                  value={formData.mealRate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 hover:shadow-md"
              >
                <span>Update Meal Schedule</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}