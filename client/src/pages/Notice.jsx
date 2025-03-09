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
        const res = await fetch("/api/notice/get_all_notice");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
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
            <AlertCircle className="h-5 w-5 mr-3" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center p-12 bg-white rounded-3xl shadow-lg border border-blue-100">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading notices...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
            {notices.length === 0 ? (
              <div className="flex flex-col justify-center items-center p-10 text-center">
                <div className="p-3 rounded-2xl bg-blue-100 mb-4">
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">No Notices Found</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no notices or announcements available at this time.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notices.map((notice, index) => (
                  <div
                    key={notice._id}
                    className="p-3 border border-blue-100 rounded-xl flex justify-between items-center hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/view_notice_details/${notice._id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-blue-100">
                        <Bell className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 text-sm">{notice.title}</span>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(notice.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-1 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-200">
                      <ArrowRight className="h-4 w-4 text-blue-500 hover:text-white transition-all duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}