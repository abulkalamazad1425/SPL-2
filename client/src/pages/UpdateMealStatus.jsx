import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, Coffee, ArrowLeft, Loader2 } from "lucide-react";

export default function UpdateMealStatus() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [mealList, setMealList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealList();
  }, []);

  const fetchMealList = async () => {
    try {
      const res = await fetch(`/api/meal/get_meallist/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      const sortedMeals = data.sort((a, b) => {
        const dateComparison = new Date(a.date) - new Date(b.date);
        if (dateComparison !== 0) return dateComparison;
        return a.mealType === "lunch" ? -1 : 1;
      });

      setMealList(sortedMeals);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateMealStatus = async (mealId) => {
    try {
      const res = await fetch(
        `/api/meal/update_mealstatus?student_id=${currentUser._id}&meal_id=${mealId}`,
        { method: "PUT" }
      );
      const data = await res.json();
      if(data.success===false){
        console.log(data.message);
        return;
      }
      setMealList((prev) =>
        prev.map((meal) =>
          meal.mealId === mealId ? { ...meal, mealStatus: data.mealStatus } : meal
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Meal Schedule</h1>
            <button
              onClick={() => navigate("/")}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-cyan-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
          <p className="text-gray-600">Manage your upcoming meal preferences</p>
        </div>

        {/* Meal List Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : mealList.length > 0 ? (
            <div className="space-y-4">
              {mealList.map((meal) => (
                <div
                  key={meal.mealId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <Coffee className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-800">
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(meal.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateMealStatus(meal.mealId)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      meal.mealStatus === "off"
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                    }`}
                  >
                    {meal.mealStatus === "off" ? "Activate Meal" : "Cancel Meal"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Coffee className="w-12 h-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium">No upcoming meals scheduled</p>
              <p className="text-sm">Check back later for new meal schedules</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}