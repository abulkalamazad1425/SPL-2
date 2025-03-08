import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddManager() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }
    
    setErrorMessage('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/teacher/add_manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success === false) {
        setErrorMessage(data.message);
        return;
      }
      
      navigate('/');
    } catch (error) {
      setErrorMessage("Failed to add manager. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-blue-100 p-5">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Add Manager
          </h1>
          <p className="text-sm text-gray-600">Create a new manager account for SHMMS</p>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm flex items-center mb-3 border border-red-200">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            {/* Left Column */}
            <div>
              <div className="mb-3">
                <label htmlFor="name" className="text-xs font-medium text-gray-700 block mb-1">
                  Manager Name
                </label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    required
                    onChange={handleChange}
                    placeholder="Enter Name"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="username" className="text-xs font-medium text-gray-700 block mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    required
                    onChange={handleChange}
                    placeholder="Enter Username"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="text-xs font-medium text-gray-700 block mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    required
                    onChange={handleChange}
                    placeholder="Enter Email"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className="mb-3">
                <label htmlFor="password" className="text-xs font-medium text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    required
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-700 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    required
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="phone" className="text-xs font-medium text-gray-700 block mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    required
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span>Add Manager</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}