import React, { useState, useEffect } from "react";
import { Calendar, Loader2, AlertCircle, CheckCircle, Search, Coffee, DollarSign, User } from "lucide-react";

export default function MealList() {
  const [selectedDate, setSelectedDate] = useState(""); // Holds selected date
  const [mealList, setMealList] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]); // Stores the filtered list
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input value
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to format today's date in YYYY-MM-DD format for input element
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Function to format date in local format for display
  const getLocalDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Fetch meals when component mounts (default to today's date)
  useEffect(() => {
    const today = getTodayDate();
    console.log(today);
    setSelectedDate(today);
    fetchMeals(today);
  }, []);

  const fetchMeals = async (date) => {
    if (!date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/meal/get_daily_meal_list?date=${date}`);

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setMealList([]);
        setFilteredMeals([]);
      } else {
        console.log(data.studentMeals);
        setMealList(data.studentMeals);
        setFilteredMeals(data.studentMeals); // Initially, filtered list is the same as full list
      }
    } catch (error) {
      console.error("Error fetching meal list:", error);
      setError("Failed to fetch meals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleServeMeal = async (mealId) => {
    try {
      const res = await fetch(`/api/meal/update_served_status/${mealId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ servedStatus: "Served" }),
      });

      const data = await res.json();

      if (data.success) {
        // Update only the clicked student's meal status
        setMealList((prevMeals) =>
          prevMeals.map((meal) =>
            meal._id === mealId ? { ...meal, servedStatus: "Served" } : meal
          )
        );

        setFilteredMeals((prevMeals) =>
          prevMeals.map((meal) =>
            meal._id === mealId ? { ...meal, servedStatus: "Served" } : meal
          )
        );
      } else {
        alert("Failed to update meal status.");
      }
    } catch (error) {
      console.error("Error updating meal status:", error);
    }
  };

  // Filter function based on `reg_no`
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredMeals(mealList); // Reset list if empty
    } else {
      const filtered = mealList.filter((meal) =>
        meal.studentRef.reg_no.includes(query)
      );
      setFilteredMeals(filtered);
    }
  };

  // Function to get formatted date display
  const getFormattedDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if a date is today
  const isToday = (dateString) => {
    const today = getTodayDate();
    // Convert dateString to YYYY-MM-DD format for comparison
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    return formattedDate === today;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Student Meal List
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and track student meals for {getFormattedDate(selectedDate)}
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-md border border-blue-100">
          <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Date Picker */}
            <div className="flex items-center w-full md:w-auto">
              <label htmlFor="mealDate" className="font-medium text-gray-700 mr-3">
                Select Date:
              </label>
              <div className="relative flex-grow">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="date"
                  id="mealDate"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    fetchMeals(e.target.value);
                  }}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="flex items-center w-full md:w-auto">
              <label htmlFor="searchStudent" className="font-medium text-gray-700 mr-3">
                Find Student:
              </label>
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="text"
                  id="searchStudent"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Enter registration number..."
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Total Meal Count */}
            <div className="flex items-center bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
              <div className="flex flex-col items-center">
                <div className="text-sm text-blue-700 font-medium">Total Meals</div>
                <div className="text-2xl font-bold text-blue-600">{mealList.length}</div>
                <div className="text-xs text-blue-500">
                  {filteredMeals.length !== mealList.length && (
                    <span>Filtered: {filteredMeals.length}</span>
                  )}
                </div>
              </div>
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
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading meals...</p>
          </div>
        ) : (
          <>
            {filteredMeals.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <Coffee className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Meals Found</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no meals scheduled for {getFormattedDate(selectedDate)} or matching your search criteria.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-left">
                        <th className="py-4 px-4 rounded-l-xl">Student</th>
                        <th className="py-4 px-4">Registration</th>
                        <th className="py-4 px-4">Meal Type</th>
                        <th className="py-4 px-4">Rate</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 rounded-r-xl text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeals.map((meal, index) => {
                        const mealIsToday = isToday(meal.mealRef.date);
                        const isUnserved = meal.servedStatus === "Unserved";
                        
                        return (
                          <tr 
                            key={meal._id} 
                            className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="p-2 rounded-full bg-blue-100 mr-3">
                                  <User className="h-4 w-4 text-blue-500" />
                                </div>
                                <span className="font-medium">{meal.studentRef.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{meal.studentRef.reg_no}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Coffee className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{meal.mealRef.mealtype}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <span>Tk </span>
                                <span>{meal.mealRef.mealrate}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                isUnserved ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                              }`}>
                                {isUnserved ? (
                                  <>Awaiting</>
                                ) : (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Served
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleServeMeal(meal._id)}
                                disabled={!mealIsToday || !isUnserved}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isUnserved && mealIsToday
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                {isUnserved ? "Serve" : "Served"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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