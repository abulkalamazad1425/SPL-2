import React, { useState, useEffect } from "react";
import { MessageSquare, Loader2, AlertCircle, Calendar, User, Clock } from "lucide-react";
import { useSelector } from "react-redux";

export default function FeedbackList() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch("/api/feedback/get_feedback_list");
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setFeedbackList(data.feedbackList);
        console.log(data.feedbackList);
      } catch (error) {
        setError("Error fetching feedback. Please try again later.");
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading feedback...</p>
      </div>
    );
  }

  // Generate background colors for cards
  const cardColors = [
    { bg: "bg-white", border: "border-blue-100", iconBg: "bg-blue-100", iconColor: "text-blue-500", contentBg: "bg-blue-50" },
    { bg: "bg-white", border: "border-purple-100", iconBg: "bg-purple-100", iconColor: "text-purple-500", contentBg: "bg-purple-50" },
    { bg: "bg-white", border: "border-pink-100", iconBg: "bg-pink-100", iconColor: "text-pink-500", contentBg: "bg-pink-50" },
    { bg: "bg-white", border: "border-indigo-100", iconBg: "bg-indigo-100", iconColor: "text-indigo-500", contentBg: "bg-indigo-50" },
    { bg: "bg-white", border: "border-cyan-100", iconBg: "bg-cyan-100", iconColor: "text-cyan-500", contentBg: "bg-cyan-50" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Student Feedback
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what our students have to say about their experiences
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Feedback list */}
        {feedbackList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
              <MessageSquare className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">No Feedback Yet</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              When students submit their feedback, it will appear here. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbackList.map((feedback, index) => {
              const colorSet = cardColors[index % cardColors.length];
              
              return (
                <div
                  key={feedback._id}
                  className={`${colorSet.bg} rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border ${colorSet.border}`}
                >
                  <div className="p-6">
                    {/* Feedback Title with icon */}
                    <div className="flex items-start mb-4">
                      <div className={`p-3 rounded-2xl ${colorSet.iconBg} mr-4`}>
                        <MessageSquare className={`h-5 w-5 ${colorSet.iconColor}`} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 pt-2">{feedback.title}</h2>
                    </div>

                    {/* Feedback Description */}
                    <div className={`rounded-2xl ${colorSet.contentBg} p-5 mb-4`}>
                      <p className="text-gray-700">{feedback.description}</p>
                    </div>

                    {/* Actions with link */}
                    <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                      <div className="flex items-center mb-2 md:mb-0 mr-auto">
                        <User className="h-4 w-4 mr-2" />
                        {feedback.studentId ? (
                          <span>
                            <span className="font-medium text-gray-800">{feedback.studentId.name}</span>
                            <span className="text-gray-500 ml-1">(Reg: {feedback.studentId.reg_no})</span>
                          </span>
                        ) : (
                          <span className="italic text-gray-500">Anonymous</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}