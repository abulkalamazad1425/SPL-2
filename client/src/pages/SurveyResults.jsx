import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, BarChart, MessageSquare, ArrowLeft, AlertCircle, Calendar, ChevronLeft } from "lucide-react";

export default function SurveyResults() {
  const { surveyId } = useParams();
  const [results, setResults] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/manager/get_survey_result/${surveyId}`);
        const data = await res.json();
        if (data.success===false) {
          setError(data.message || "Failed to fetch survey results");
          return;
        }
        setResults(data.results);
        // Assuming the API also returns survey details
        if (data.survey) {
          setSurveyTitle(data.survey.title);
          setExpiryDate(data.survey.expiresAt);
        }
      } catch (error) {
        console.error("Error fetching survey results:", error);
        setError("Failed to fetch survey results. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [surveyId]);

  // Function to get formatted date display
  const getFormattedDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate percentages for responses
  const calculatePercentages = (responses) => {
    const total = responses.reduce((sum, resp) => sum + resp.count, 0);
    return responses.map(resp => ({
      ...resp,
      percentage: total > 0 ? Math.round((resp.count / total) * 100) : 0
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-20 min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading survey results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <BarChart className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Survey Results
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            {surveyTitle || "Analysis of survey responses"}
          </p>
          {expiryDate && (
            <div className="flex justify-center items-center space-x-2 text-gray-500">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>Expires on: {getFormattedDate(expiryDate)}</span>
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}
        
        {results.length === 0 && !error ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100 mb-8">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
              <BarChart className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">No Responses Yet</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              There are no responses to this survey yet. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {results.map((result, index) => {
              const isOpenEnded = result.responses.some((resp) => resp.answerType === "open-ended");
              const responsesWithPercentages = isOpenEnded ? result.responses : calculatePercentages(result.responses);
              
              return (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">
                    {result.question}
                  </h2>

                  {/* Open-ended questions: Show responses as text */}
                  {isOpenEnded ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4 text-blue-600">
                        <MessageSquare className="w-5 h-5" />
                        <h3 className="font-medium">Text Responses ({result.responses.length})</h3>
                      </div>
                      {result.responses.length === 0 ? (
                        <p className="text-gray-500 italic p-4">No responses yet</p>
                      ) : (
                        result.responses.map((resp, i) => (
                          <div key={i} className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-gray-700">{resp.answer}</p>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    // Visualize multiple-choice, rating, and yes/no questions
                    <div>
                      <div className="space-y-4 mb-6">
                        {responsesWithPercentages.map((resp, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-gray-700">{resp.answer}</span>
                              <span className="text-blue-600">{resp.count} ({resp.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                                style={{ width: `${resp.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Summary table */}
                      <div className="overflow-hidden rounded-xl border border-gray-200 mt-6">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                              <th className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">Answer</th>
                              <th className="p-3 text-center font-semibold text-gray-700 border-b border-gray-200">Count</th>
                              <th className="p-3 text-right font-semibold text-gray-700 border-b border-gray-200">Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            {responsesWithPercentages.map((resp, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
                                <td className="p-3 border-b border-gray-100">{resp.answer}</td>
                                <td className="p-3 text-center border-b border-gray-100 font-medium">{resp.count}</td>
                                <td className="p-3 text-right border-b border-gray-100 font-medium">{resp.percentage}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/view_survey")}
          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Surveys</span>
        </button>
      </div>
    </div>
  );
}