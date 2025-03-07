import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowRight, Calendar, Loader2, AlertCircle } from "lucide-react";

export default function Notice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/auth/get_all_notice");
        const data = await res.json();
        if (data.success === false) {
          setError("Failed to fetch notices. Please try again.");
          return;
        } 
        setNotices(data.notices);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 mt-16">
        <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
        <p className="text-blue-600 text-lg font-medium animate-pulse">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-16" >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Notices & Announcements
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with important information and announcements
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Notices List */}
        {notices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
              <Bell className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">No Notices Found</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              There are no notices or announcements available at this time.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
            <div className="space-y-3">
              {notices.map((notice, index) => {
                // Generate pastel colors for hover effect similar to FeedbackList
                const colors = [
                  "hover:bg-blue-50",
                  "hover:bg-purple-50",
                  "hover:bg-pink-50",
                  "hover:bg-indigo-50",
                  "hover:bg-cyan-50"
                ];
                const colorIndex = index % colors.length;
                
                return (
                  <div
                    key={notice._id}
                    className={`p-5 border border-blue-100 rounded-xl flex justify-between items-center ${colors[colorIndex]} cursor-pointer transition-all duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                    } hover:shadow-md`}
                    onClick={() => navigate(`/view_notice_details/${notice._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-2xl bg-blue-100 shadow-sm">
                        <Bell className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 block">{notice.title}</span>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(notice.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-200">
                      <ArrowRight className="h-5 w-5 text-blue-500 group-hover:text-white transition-all duration-200" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}