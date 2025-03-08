import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, User, CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

export default function RegVerification() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success', 'error', or 'info'
  const [otpSent, setOtpSent] = useState(false);
  const [otpMatchMessage, setOtpMatchMessage] = useState(null);
  const [otpMessageType, setOtpMessageType] = useState(null); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const verifyRegNo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/student/reg_verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setMessage(data.message);
        setMessageType('error');
        setIsLoading(false);
        return;
      }
      setOtpSent(true);
      setMessage(data.message);
      setMessageType('info'); // OTP sent is an info message
    } catch (error) {
      setMessage("Verification failed. Please try again.");
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const verify_otp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/student/otp_verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setOtpMatchMessage(data.message);
        setOtpMessageType('error');
        setIsLoading(false);
        return;
      }
      // Show success message before navigating
      setOtpMatchMessage("OTP verified successfully!");
      setOtpMessageType('success');
      setTimeout(() => {
        navigate(`/registration/${data._id}`);
      }, 1000); // Give the user a moment to see the success message
    } catch (error) {
      setOtpMatchMessage("OTP verification failed. Please try again.");
      setOtpMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get message styling based on type
  const getMessageStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'error':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Helper function to get appropriate icon
  const getMessageIcon = (type, message) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 mr-2" />;
      case 'error':
        return <XCircle className="h-5 w-5 mr-2" />;
      case 'info':
        return <Mail className="h-5 w-5 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 flex justify-center items-center mt-12">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-6 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Registration Verification
            </span>
          </h1>
          <p className="text-gray-600">
            Verify your registration number to proceed with your account setup
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <form className="space-y-6">
            {/* Registration Number Input */}
            <div>
              <label htmlFor="reg_no" className="font-medium text-gray-700 block mb-2">
                Registration Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="text"
                  id="reg_no"
                  placeholder="Enter your registration number"
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {!otpSent && (
              <button
                type="button"
                onClick={verifyRegNo}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify Registration Number"
                )}
              </button>
            )}

            {/* Success or error message for reg_no verification */}
            {message && messageType && (
              <div
                className={`flex items-center p-3 rounded-xl ${getMessageStyles(messageType)}`}
              >
                {getMessageIcon(messageType, message)}
                <p>{message}</p>
              </div>
            )}

            {/* OTP Input and Verification */}
            {otpSent && (
              <>
                <div>
                  <label htmlFor="otp" className="font-medium text-gray-700 block mb-2">
                    OTP Verification
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="text"
                      id="otp"
                      placeholder="Enter the OTP sent to your email"
                      onChange={handleChange}
                      className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={verify_otp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Verifying OTP...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </>
            )}

            {/* Back to Login Button */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
              >
                Back to Login
              </button>
            </div>
          </form>

          {/* OTP match message (success or error) */}
          {otpMatchMessage && otpMessageType && (
            <div className={`mt-4 flex items-center p-3 rounded-xl ${getMessageStyles(otpMessageType)}`}>
              {getMessageIcon(otpMessageType)}
              <p>{otpMatchMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}