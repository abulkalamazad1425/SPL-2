import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, Coffee, ArrowLeft } from "lucide-react";

export default function UpdateMealStatus() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [mealList, setMealList] = useState([]);

  useEffect(() => {
    fetchMealList();
  }, []);

  const fetchMealList = async () => {
    const res = await fetch(`/api/student/get_meallist/${currentUser._id}`);
    const data = await res.json();
    if (data.success===false) {
      console.log(data.message);
      return;
    }

    // Sort first by date, then by mealType (lunch first, then dinner)
    const sortedMeals = data.sort((a, b) => {
      // First sort by date
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) return dateComparison;

      // If dates are the same, prioritize lunch over dinner
      return a.mealType === "lunch" ? -1 : 1;
    });

    setMealList(sortedMeals);
  };

  const updateMealStatus = async (mealId) => {
    const res = await fetch(`/api/student/update_mealstatus?student_id=${currentUser._id}&meal_id=${mealId}`, {
      method: "PUT",
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
      return;
    }

    // Update meal status locally
    setMealList((prev) =>
      prev.map((meal) =>
        meal.mealId === mealId ? { ...meal, mealStatus: data.mealStatus } : meal
      )
    );
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Update Meal Status</h1>
          <p className="text-gray-600">Manage your upcoming meals</p>
        </div>

        {/* Meal List */}
        {mealList.length > 0 ? (
          <ul className="space-y-4">
            {mealList.map((meal) => (
              <li
                key={meal.mealId}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white hover:shadow-md"
              >
                <div className="flex flex-1 items-center space-x-4">
                  <Coffee className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-800 w-24 truncate">
                    {meal.mealType.toUpperCase()}
                  </span>
                  <div className="flex items-center text-gray-600 space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(meal.date).toDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => updateMealStatus(meal.mealId)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    meal.mealStatus === "off"
                      ? "border border-gray-300 text-gray-700 hover:bg-green-50"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {meal.mealStatus === "off" ? "Turn On" : "Turn Off"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming meals found.</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
