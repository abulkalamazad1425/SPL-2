import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Coffee, AlertCircle, LogIn } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logInSuccess } from '../redux/user/userSlice.js';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    reg_no: '',
    password: '',
    usertype: "student",
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [typeChoosen, setTypeChoosen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleUserChange = (e) => {
    if (e.target.name === "usertype") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.id
      });
    }
  }

  const handlePayNow = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/student/registration_payment?studentId=${studentId}&paymentId=${paymentId}`);
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage("Problem with online payment");
        return;
      }
      window.open(data.url);
    } catch (error) {
      setErrorMessage("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayLater = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success === false) {
        setErrorMessage(data.message);
        return;
      }
      
      if (formData.usertype === 'student') {
        if (data.reg_payment === 'paid') {
          dispatch(logInSuccess(data));
          navigate('/');
        } else {
          setStudentId(data._id);
          setPaymentId('registration');
          setModalShow(true);
        }
      } else {
        dispatch(logInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Welcome to SHMMS
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Student Hostel Meal Management System
          </p>
        </div>

        {!typeChoosen ? (
          /* User Type Selection Section */
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
            <div className="text-center mb-6">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                <User className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Choose User Type</h2>
              <p className="text-gray-600 mt-2">Please select your user type to proceed</p>
            </div>

            <form className="space-y-6">
              <div className="space-y-4 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <label className="text-base font-medium text-gray-700 block mb-2">
                  User Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200">
                    <input
                      type="radio"
                      name="usertype"
                      id="student"
                      checked={formData.usertype === "student"}
                      onChange={handleUserChange}
                      className="sr-only"
                    />
                    <div className={`p-2 rounded-full ${formData.usertype === "student" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"} mb-2`}>
                      <User className="h-6 w-6" />
                    </div>
                    <span className={`text-sm font-medium ${formData.usertype === "student" ? "text-blue-600" : "text-gray-700"}`}>Student</span>
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200">
                    <input
                      type="radio"
                      name="usertype"
                      id="admin"
                      checked={formData.usertype === "admin"}
                      onChange={handleUserChange}
                      className="sr-only"
                    />
                    <div className={`p-2 rounded-full ${formData.usertype === "admin" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"} mb-2`}>
                      <User className="h-6 w-6" />
                    </div>
                    <span className={`text-sm font-medium ${formData.usertype === "admin" ? "text-blue-600" : "text-gray-700"}`}>Admin</span>
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200">
                    <input
                      type="radio"
                      name="usertype"
                      id="manager"
                      checked={formData.usertype === "manager"}
                      onChange={handleUserChange}
                      className="sr-only"
                    />
                    <div className={`p-2 rounded-full ${formData.usertype === "manager" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500"} mb-2`}>
                      <User className="h-6 w-6" />
                    </div>
                    <span className={`text-sm font-medium ${formData.usertype === "manager" ? "text-blue-600" : "text-gray-700"}`}>Manager</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTypeChoosen(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>
          </div>
        ) : (
          /* Login Form Section */
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
            <div className="text-center mb-6">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                <LogIn className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-600 mt-2">
                {formData.usertype === "student" ? "Student Access" : formData.usertype === "admin" ? "Administrator Access" : "Manager Access"}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-base flex items-center mb-6 shadow-sm border border-red-200">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Registration Number/Username Input */}
                <div>
                  <label htmlFor="reg_no" className="text-sm font-medium text-gray-700 block mb-2">
                    {formData.usertype === "student" ? "Registration Number" : "Username"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="text"
                      id="reg_no"
                      value={formData.reg_no}
                      required
                      onChange={handleChange}
                      placeholder={formData.usertype === "student" ? "Enter Registration Number" : "Enter Username"}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      required
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              {/* Links Section */}
              <div className="pt-4 space-y-4">
                {formData.usertype === "student" && (
                  <div className="flex items-center justify-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-gray-600 mr-2">Don't have an account?</span>
                    <button
                      type="button"
                      onClick={() => navigate('/registration_verification')}
                      className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
                    >
                      Register now
                    </button>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => navigate('/forget_password', { state: { userType: formData.usertype } })}
                  className="text-blue-600 hover:text-blue-700 font-medium transition duration-200 w-full text-center"
                >
                  Forgot your password?
                </button>
                
                <button
                  type="button"
                  onClick={() => setTypeChoosen(false)}
                  className="text-gray-500 hover:text-gray-700 font-medium transition duration-200 w-full text-center text-sm"
                >
                  Change user type
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {modalShow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6 border border-blue-100">
            <div className="text-center mb-6">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                <AlertCircle className="h-10 w-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Registration Fee Required</h2>
              <p className="text-gray-600 mt-2">You need to pay the registration fee before accessing the system</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay Now</span>
                )}
              </button>
              <button
                onClick={handlePayLater}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Pay Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}