import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, Coffee, Calendar, Search } from "lucide-react";

export default function MealHistory() {
  const { studentId } = useParams();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMealHistory() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/student/meal_history/${studentId}`);
        const data = await res.json();
        if (data.success) {
          setMeals(data.mealHistory);
          setFilteredMeals(data.mealHistory);
        } else {
          setError(data.message || "Failed to fetch meal history");
          setMeals([]);
          setFilteredMeals([]);
        }
      } catch (error) {
        console.error("Error fetching meal history:", error);
        setError("Failed to fetch meal history. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchMealHistory();
  }, [studentId]);

  // Filter function based on date
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredMeals(meals); // Reset list if empty
    } else {
      const filtered = meals.filter((meal) =>
        new Date(meal.mealRef.date).toLocaleDateString().includes(query)
      );
      setFilteredMeals(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Meal History
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Detailed record of your meal transactions
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-md border border-blue-100">
          <div className="flex items-center w-full">
            <label htmlFor="searchDate" className="font-medium text-gray-700 mr-3">
              Search by Date:
            </label>
            <div className="relative flex-grow">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
              <input
                type="text"
                id="searchDate"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Enter date (MM/DD/YYYY)..."
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
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading meal history...</p>
          </div>
        ) : (
          <>
            {filteredMeals.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <Coffee className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Meal History</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  You have no recorded meal transactions.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-left">
                        <th className="py-4 px-4 rounded-l-xl">Date</th>
                        <th className="py-4 px-4">Meal Type</th>
                        <th className="py-4 px-4">Meal Status</th>
                        <th className="py-4 px-4 rounded-r-xl">Served Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeals.map((meal, index) => (
                        <tr 
                          key={meal._id} 
                          className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              <span>{new Date(meal.mealRef.date).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Coffee className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{meal.mealRef.mealtype}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              meal.mealStatus === 'Confirmed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {meal.mealStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${
                              meal.servedStatus === 'Served' 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {meal.servedStatus}
                            </span>
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