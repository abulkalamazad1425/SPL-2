import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Key, CheckCircle, ArrowRight, Clock, AlertCircle, Loader } from 'lucide-react';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get userType from location state or fall back to 'student'
  const [userType, setUserType] = useState(() => {
    return location.state?.userType || 'student';
  });
  
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP input, 3: Reset password
  const [formData, setFormData] = useState({
    identifier: '', // reg_no for students, username for admin/manager
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const [otpSent, setOtpSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // Timer state for OTP resend
  const [resendTimer, setResendTimer] = useState(0); // Time in seconds
  const [canResend, setCanResend] = useState(true);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpSent && resendTimer === 0) {
      setCanResend(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, otpSent]);

  // Request OTP
  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    setMessage({ text: '', isError: false });
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/request_password_reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          userType: userType
        }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setMessage({ text: data.message, isError: true });
        setIsLoading(false);
        return;
      }
      
      setOtpSent(true);
      setMessage({ text: data.message || 'OTP sent to your registered email', isError: false });
      setStep(2);
      
      // Set resend timer to 5 minutes (300 seconds)
      setResendTimer(300);
      setCanResend(false);
    } catch (error) {
      setMessage({ text: 'Failed to send OTP. Please try again.', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });
    setIsVerifying(true);
    
    try {
      const res = await fetch('/api/auth/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          userType: userType,
          otp: formData.otp
        }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setMessage({ text: data.message || 'Invalid OTP', isError: true });
        setIsVerifying(false);
        return;
      }
      
      setMessage({ text: 'OTP verified successfully', isError: false });
      setStep(3);
    } catch (error) {
      setMessage({ text: 'Failed to verify OTP. Please try again.', isError: true });
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });
    setIsResetting(true);
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', isError: true });
      setIsResetting(false);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          userType: userType,
          otp: formData.otp,
          newPassword: formData.newPassword
        }),
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        setMessage({ text: data.message, isError: true });
        setIsResetting(false);
        return;
      }
      
      setResetSuccess(true);
      setMessage({ text: 'Password reset successful', isError: false });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Failed to reset password. Please try again.', isError: true });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Reset Password
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reset your password for SHMMS
            <span className="ml-1 font-medium">
              ({userType === 'student' ? 'Student' : userType === 'admin' ? 'Admin' : 'Manager'})
            </span>
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-blue-100">
          {/* Progress Steps */}
          <div className="px-6 pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <User className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">Identify</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Key className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">Verify</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Lock className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1">Reset</span>
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mx-6 ${message.isError ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-100 text-green-600 border border-green-200'} px-4 py-3 rounded-xl text-sm flex items-center mb-4`}>
              {message.isError ? (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              {message.text}
            </div>
          )}

          <div className="p-6">
            {/* Step 1: Initial Form */}
            {step === 1 && (
              <form onSubmit={handleRequestOTP} className="space-y-5">
                {/* Identifier Input (Registration Number or Username) */}
                <div className="relative">
                  <label htmlFor="identifier" className="text-sm font-medium text-gray-700 block mb-2">
                    {userType === "student" ? "Registration Number" : "Username"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="text"
                      id="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      required
                      placeholder={userType === "student" ? "Enter Registration Number" : "Enter Username"}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <Mail className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                {/* Back to Login Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
                    disabled={isLoading}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
                  <p className="text-blue-700 text-sm">
                    An OTP has been sent to your registered email address. Please check your inbox and enter the code below.
                  </p>
                </div>
                
                <div className="relative">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="text"
                      id="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      required
                      placeholder="Enter the OTP sent to your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={isVerifying}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <CheckCircle className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                {/* Resend OTP Button with Timer */}
                <div className="text-center pt-2">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleRequestOTP}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700 font-medium transition duration-200 flex items-center justify-center mx-auto space-x-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Resending...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          <span>Resend OTP</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Resend OTP in {formatTime(resendTimer)}</span>
                    </div>
                  )}
                </div>
              </form>
            )}

            {/* Step 3: Reset Password Form */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password Input */}
                <div className="relative">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="password"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={isResetting}
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={isResetting}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isResetting ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Success Message Modal */}
      {resetSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6 border border-blue-100">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Success!</h2>
              <p className="text-gray-600">Your password has been reset successfully.</p>
              <p className="text-blue-500 text-sm">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}