import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useDispatch,useSelector } from 'react-redux';
import { logInSuccess } from '../redux/user/userSlice.js';

export default function Login() {
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [formData, setFormData] = useState({
    reg_no: '',
    password: '',
    usertype:"student",
  });
  const [errorMessage, setErrorMessage] = useState('');
  //const [userType,setUserType]=useState('student');
  const [typeChoosen,setTypeChoosen]=useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleUserChange=(e)=>{
    if(e.target.name==="usertype"){
      setFormData({
        ...formData,
        [e.target.name]:e.target.id
    });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    setErrorMessage('');
    dispatch(logInSuccess(data));
    navigate('/about');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {!typeChoosen ? (
              <div className="w-full max-w-md p-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-gray-800">Choose User Type</h1>
                  <p className="text-gray-500">Please select your user type to proceed</p>
                </div>
      
                {/* Form Section */}
                <form className="space-y-5">
                  <div className="space-y-4">
                    {/* Radio Buttons for User Type */}
                    <div className="space-y-2">
                      <label htmlFor="usertype" className="text-sm font-medium text-gray-700 block mb-2">
                        User Type
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="usertype"
                            id="student"
                            checked={formData.usertype === "student"}
                            onChange={handleUserChange}
                            className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Student</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="usertype"
                            id="admin"
                            checked={formData.usertype === "admin"}
                            onChange={handleUserChange}
                            className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Admin</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="usertype"
                            id="manager"
                            checked={formData.usertype === "manager"}
                            onChange={handleUserChange}
                            className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Manager</span>
                        </label>
                      </div>
                    </div>
                  </div>
      
                  {/* Confirm Button */}
                  <button
                    type="button"
                    onClick={() => setTypeChoosen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Confirm Type</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </form>
              </div>
            </div>
      ):(
        <div className="w-full max-w-md p-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-500">Sign in to SHMMS</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Registration Number Input */}
              <div className="relative">
                <label htmlFor="reg_no" className="text-sm font-medium text-gray-700 block mb-2">
                  {formData.usertype==="student" ? "Registration Number":"Username"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="reg_no"
                    value={formData.reg_no}
                    required
                    onChange={handleChange}
                    placeholder={formData.usertype==="student" ? "Enter Registration Number":"Enter Username"}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    required
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Links Section */}
            <div className="flex flex-col space-y-4 text-center pt-4">
              {formData.usertype==="student" && (
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-gray-500">Don't have an account?</span>
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
                onClick={() => navigate('/forget_password')}
                className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

    </div>
  );
}