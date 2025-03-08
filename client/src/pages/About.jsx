import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUtensils, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartPie, 
  FaMoneyBill, 
  FaComment 
} from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              About Shahidullah Hall Mess
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the history, facilities, and services offered by Shahidullah Hall Mess.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Shahidullah Hall Mess</h2>
            <p className="text-lg text-gray-600 mb-6">
              Shahidullah Hall Mess is one of the most well-known and well-managed mess facilities in the university. 
              It provides nutritious and delicious meals to students, ensuring a healthy and balanced diet. 
              Our mess is equipped with modern facilities and follows strict hygiene standards.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              We offer a variety of meal options, including vegetarian and non-vegetarian dishes, to cater to the diverse 
              preferences of our students. Our dedicated staff works tirelessly to ensure that every meal is prepared 
              with care and served on time.
            </p>
            
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Features</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-3 rounded-2xl bg-blue-100 mr-4 shadow-sm">
                  <FaUtensils className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Nutritious Meals</h3>
                  <p className="text-gray-600">
                    We provide balanced and healthy meals prepared with fresh ingredients.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 rounded-2xl bg-purple-100 mr-4 shadow-sm">
                  <FaUsers className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Dedicated Staff</h3>
                  <p className="text-gray-600">
                    Our experienced staff ensures timely and hygienic meal preparation.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 rounded-2xl bg-pink-100 mr-4 shadow-sm">
                  <FaChartPie className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Meal Tracking</h3>
                  <p className="text-gray-600">
                    Students can track their meal preferences and schedules easily.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 rounded-2xl bg-indigo-100 mr-4 shadow-sm">
                  <FaMoneyBill className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Affordable Pricing</h3>
                  <p className="text-gray-600">
                    We offer meals at affordable prices to ensure accessibility for all students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}