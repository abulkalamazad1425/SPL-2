import React, { useState } from 'react';
import { MessageSquare, Send, AlertCircle, Check } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function GiveFeedback() {
  const { currentUser } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({ success: false, error: '' });
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    if (id === 'description') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res=await fetch(`/api/student/submit_feedback/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData),
      })
      const data=await res.json();
      if(data.success===false){
        alert('feedback is not submitted');
        return;
      }
      setFeedbackStatus({ success: true, error: '' });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          description: ''
        });
        setCharCount(0);
      }, 2000);

    } catch (error) {
      setFeedbackStatus({ success: false, error: 'Failed to submit feedback. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-2xl p-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Give Feedback</h1>
            <p className="text-gray-500">Share your thoughts, suggestions, or concerns</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Feedback Title Input */}
              <div className="relative">
                <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Summarize your feedback"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* Feedback Description Input */}
              <div className="relative">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Please provide detailed information about your feedback"
                  rows="6"
                  maxLength="1000"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                ></textarea>
                <div className="text-xs text-gray-500 text-right mt-1">
                  {charCount}/1000 characters
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {feedbackStatus.error && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {feedbackStatus.error}
              </div>
            )}
            
            {feedbackStatus.success && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Your feedback has been submitted successfully! Thank you for helping us improve.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <Send className="h-5 w-5 ml-1" />
                </>
              )}
            </button>

            {/* Feedback Policy */}
            <div className="text-xs text-gray-500 text-center">
              Your feedback is valuable to us and will be reviewed by the administration.
              <br />We may contact you for further details if needed.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
