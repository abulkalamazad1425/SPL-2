import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, User, CheckCircle, XCircle } from 'lucide-react';

export default function RegVerification() {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpMatchMessage, setOtpMatchMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const verifyRegNo = async (e) => {
    e.preventDefault();
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
      return;
    }
    setOtpSent(true);
    setMessage(data.message);
  };

  const verify_otp = async (e) => {
    e.preventDefault();
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
      return;
    }
    navigate('/registration', { state: data });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Registration Verification</h2>
        <p className="text-center text-gray-500">Verify your registration number to proceed</p>

        <form>
          {/* Registration Number Input */}
          <div className="relative">
            <label htmlFor="reg_no" className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                id="reg_no"
                placeholder="Enter Registration Number"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={verifyRegNo}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-200 mt-4"
          >
            Verify Registration Number
          </button>

          {/* Success or error message for reg_no verification */}
          {message && (
            <div
              className={`mt-4 flex items-center space-x-2 ${
                message === 'OTP sent successfully' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message === 'OTP sent successfully' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* OTP Input and Verification */}
          {otpSent && (
            <div className="space-y-4 mt-6">
              <div className="relative">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter OTP"
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={verify_otp}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition duration-200"
              >
                Verify OTP
              </button>
            </div>
          )}
        </form>

        {/* OTP match error message */}
        {otpMatchMessage && (
          <div className="mt-4 flex items-center space-x-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <p className="text-sm">{otpMatchMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
