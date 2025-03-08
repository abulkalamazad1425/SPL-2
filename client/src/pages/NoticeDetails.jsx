import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, FileText, Loader2, Calendar, AlertCircle, ExternalLink } from "lucide-react";

export default function NoticeDetails() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNoticeDetails() {
      try {
        const res = await fetch(`/api/auth/get_single_notice/${noticeId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || "Notice not found");
          return;
        }
        setNotice(data.notice);
      } catch (error) {
        console.error("Error fetching notice details:", error);
        setError("Failed to load notice details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchNoticeDetails();
  }, [noticeId, navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString || Date.now());
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
            <button
              onClick={() => navigate("/view_notice")}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition duration-200 flex items-center text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center p-20 bg-white rounded-3xl shadow-lg border border-blue-100">
            <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading notice details...</p>
          </div>
        ) : notice ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-blue-100">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                  {notice.title}
                </span>
              </h1>
              <div className="flex items-center justify-center text-gray-600 mt-2">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(notice.createdAt)}</span>
              </div>
            </div>
            
            {/* Notice Content */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{notice.description}</p>
              </div>
            </div>
            
            {/* PDF Attachment */}
            {notice.pdfFile && (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                <div className="border border-blue-100 rounded-xl p-5 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-xl bg-red-100">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 block">Attached Document</span>
                      <span className="text-sm text-gray-500">Click to view or download</span>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:3000/${notice.pdfFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-medium transition duration-200 flex items-center"
                  >
                    <span>View PDF</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            )}
            
            {/* Back Button */}
            <div className="bg-white rounded-3xl px-8 py-6 shadow-lg border border-blue-100">
              <button
                onClick={() => navigate("/view_notice")}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Notices</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
            <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
              <Bell className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Notice Not Found</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-6">
              The notice you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/view_notice")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Notices</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}