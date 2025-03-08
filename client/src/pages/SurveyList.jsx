import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, CheckSquare, BarChart, Clock, Loader2, AlertCircle } from "lucide-react";

export default function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // Get currentUser from Redux store
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await fetch("/api/student/get_all_survey");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || "Failed to fetch surveys");
          setSurveys([]);
        } else {
          setSurveys(data.surveys);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setError("Failed to fetch surveys. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  // Function to get formatted date display
  const getFormattedDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Available Surveys
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentUser?.usertype === "student" ? 
              "Participate and share your valuable feedback" : 
              "View and analyze survey responses"
            }
          </p>
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
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading surveys...</p>
          </div>
        ) : (
          <>
            {surveys.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <CheckSquare className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Surveys Available</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no active surveys at the moment. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {surveys.map((survey) => (
                  <div 
                    key={survey._id} 
                    className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 transition-all hover:shadow-xl hover:border-blue-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{survey.title}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Expires: {getFormattedDate(survey.expiresAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {currentUser?.usertype === "student" ? (
                          <button
                            onClick={() => navigate(`/survey_response/${survey._id}`)}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition duration-200 flex items-center space-x-2"
                          >
                            <CheckSquare className="h-5 w-5" />
                            <span>Take Survey</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/view_survey_result/${survey._id}`)}
                            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium transition duration-200 flex items-center space-x-2"
                          >
                            <BarChart className="h-5 w-5" />
                            <span>View Results</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}