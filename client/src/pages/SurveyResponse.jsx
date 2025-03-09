import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle, MessageSquare, Star, ArrowRight, Loader2, AlertCircle, Calendar } from 'lucide-react';

export default function SurveyResponse() {
  const { surveyId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSurvey() {
      try {
        const res = await fetch(`/api/survey/get_single_survey/${surveyId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || "Failed to fetch survey details");
          return;
        }
        setSurvey(data.survey);
      } catch (error) {
        console.error("Error fetching survey:", error);
        setError("Failed to fetch survey details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchSurvey();
  }, [surveyId, navigate]);

  const handleResponseChange = (questionIndex, value) => {
    setResponses({ ...responses, [questionIndex]: value });
  };

  const handleSubmit = async () => {
    // Validate if all questions are answered
    const unansweredQuestions = survey.questions.filter((_, index) => !responses[index]);
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions before submitting (${unansweredQuestions.length} remaining)`);
      return;
    }

    setSubmitting(true);
    setError("");
    
    try {
      const res = await fetch(`/api/survey/give_survey_response/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId, responses }),
      });

      const data = await res.json();
      if (data.success) {
        navigate("/");
      } else {
        setError(data.message || "Failed to submit response");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      setError("Failed to submit response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Function to get formatted date display
  const getFormattedDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading survey...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
        <AlertCircle className="h-14 w-14 text-red-500 mb-4" />
        <p className="text-red-600 text-lg font-medium">Survey not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {survey.title}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please share your Response {getFormattedDate(survey.expiresAt)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Questions Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 mb-8">
          <div className="space-y-8">
            {survey.questions.map((q, index) => (
              <div key={index} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                <label className="text-lg font-medium text-gray-800 block flex items-center space-x-3 mb-4">
                  <span className="bg-blue-100 text-blue-500 rounded-full p-2 flex items-center justify-center w-8 h-8">
                    {index + 1}
                  </span>
                  <span>{q.question}</span>
                </label>

                {q.type === "multiple-choice" && (
                  <div className="space-y-3 pl-11">
                    {q.options.map((option, i) => (
                      <label key={i} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-blue-50 transition-colors">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          onChange={() => handleResponseChange(index, option)}
                          className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "yes-no" && (
                  <div className="flex items-center space-x-6 pl-11">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value="Yes"
                        onChange={() => handleResponseChange(index, "Yes")}
                        className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-blue-50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value="No"
                        onChange={() => handleResponseChange(index, "No")}
                        className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">No</span>
                    </label>
                  </div>
                )}

                {q.type === "rating-scale" && (
                  <div className="pl-11">
                    <div className="relative">
                      <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                      <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        onChange={(e) => handleResponseChange(index, e.target.value)}
                      >
                        <option value="">Select a rating</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {q.type === "open-ended" && (
                  <div className="pl-11">
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-blue-500 h-5 w-5" />
                      <textarea
                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        rows="4"
                        placeholder="Your answer..."
                        onChange={(e) => handleResponseChange(index, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full py-4 rounded-2xl font-medium flex items-center justify-center space-x-2 group shadow-lg transition-all duration-200 ${
            submitting 
              ? "bg-gray-400 text-gray-100 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Response</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}