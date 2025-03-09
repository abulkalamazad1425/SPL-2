import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Phone, User, Edit2, CheckCircle, Upload, CreditCard, ClipboardList,BookOpen,FileText,LogIn, LogOut, DollarSign, RefreshCw, Lock } from 'lucide-react';
import { updateProfileSuccess, logOutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function ManagerProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [photoPreview, setPhotoPreview] = useState(`http://localhost:3000/${currentUser.photo}`);
  const [photoFile, setPhotoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const fileInputRef = useRef(null);
  
  // New states for registration fee functionality
  const [isUpdatingFee, setIsUpdatingFee] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
  const [newFee, setNewFee] = useState('');
  const [feeUpdateSuccess, setFeeUpdateSuccess] = useState(false);
  const [feeUpdateError, setFeeUpdateError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/log_out');
      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || 'Logout failed');
      }

      dispatch(logOutSuccess());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setPhotoFile(file);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      const response = await fetch(`/api/auth/update_profile/${currentUser._id}`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || 'Failed to update profile');
      }
      dispatch(updateProfileSuccess(data));
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(false);
        setPhotoPreview(`http://localhost:3000/${data.photo}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setChangeError('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setChangeError('New passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/change_password/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success === false) {
        setChangeError(data.message);
        throw new Error(data.message || 'Failed to change password');
      }

      setChangeSuccess(true);
      setTimeout(() => {
        setIsChangingPassword(false);
        setError('');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        setChangeSuccess(false);
      }, 1000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // New functions for registration fee functionality
  const handleGetRegistrationFee = async () => {
    setIsLoading(true);
    setFeeUpdateError('');
    
    try {
      const response = await fetch('/api/manager/get_registration_fee');
      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || 'Failed to get registration fee');
      }
      
      setCurrentFee(data.fee);
      setNewFee(data.fee);
      setIsUpdatingFee(true);
    } catch (err) {
      console.error('Error getting registration fee:', err);
      setFeeUpdateError(err.message || 'Failed to get registration fee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFeeChange = (e) => {
    setNewFee(e.target.value);
  };
  
  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeeUpdateError('');
    setFeeUpdateSuccess(false);
    
    try {
      const response = await fetch('/api/manager/update_registration_fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fee: Number(newFee)
        }),
      });
      
      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || 'Failed to update registration fee');
      }
      
      setFeeUpdateSuccess(true);
      setTimeout(() => {
        setIsUpdatingFee(false);
        setFeeUpdateSuccess(false);
        setCurrentFee(null);
        setNewFee('');
      }, 1000);
    } catch (err) {
      console.error('Error updating registration fee:', err);
      setFeeUpdateError(err.message || 'Failed to update registration fee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-20 sm:mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Manager Profile
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage your personal information
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <CheckCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-100 text-green-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-green-200">
            <CheckCircle className="h-6 w-6 mr-3" />
            Profile updated successfully!
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0 w-40">
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Manager Profile"
                  className="w-32 h-32 mx-auto object-cover rounded-full border-4 border-blue-100"
                />
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button 
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition duration-200"
                  title="Change profile picture"
                >
                  {isEditing ? <Upload className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </button>
              </div>
              {isEditing && <p className="text-xs text-center mt-2 text-gray-500">Click the icon to upload a new photo</p>}
            </div>

            {/* Profile Info */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex-grow space-y-4 w-full">
                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex justify-center items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPhotoPreview(currentUser?.photo || '/default-profile-photo.jpg');
                      setPhotoFile(null);
                      setError('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-grow space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Manager Details */}
                  <div className="space-y-4">
                    <div className="flex items-center bg-blue-50/50 p-4 rounded-xl">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">{currentUser?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-blue-50/50 p-4 rounded-xl">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{currentUser?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-blue-50/50 p-4 rounded-xl">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <Phone className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">{currentUser?.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center bg-blue-50/50 p-4 rounded-xl">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Balance</p>
                        <p className="font-medium text-gray-800">Tk {currentUser?.balance || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center bg-blue-50/50 p-4 rounded-xl">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Jamanat Balance</p>
                        <p className="font-medium text-gray-800">Tk {currentUser?.jamanatBalance || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 mt-6"
                >
                  Edit Profile
                </button>

                {/* Change Password Button */}
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 mt-4"
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 mt-8 space-y-4">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Additional Actions
          </h2>         
          {/* Payment History Button */}
          <button
            onClick={() => {navigate(`/view_all_transaction`)}}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center gap-2 hover:shadow-md"
          >
            <CreditCard className="h-5 w-5" />
            View Payment History
          </button>

          {/* Refund History Button */}
          <button
            onClick={() => {navigate(`/view_refund_history`)}}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center gap-2 hover:shadow-md"
          >
            <BookOpen className="h-5 w-5" />
            View Refund History
          </button>

          {/* Update Registration Fee Button */}
          <button
            onClick={handleGetRegistrationFee}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center gap-2 hover:shadow-md"
          >
            <FileText className="h-5 w-5" />
            Update Registration Fee
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center gap-2 hover:shadow-md"
          >
            <LogIn className="h-5 w-5" />
            Log out
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 block mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700 block mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                  <input
                    type="password"
                    id="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>
              {changeError && (
                <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  {changeError}
                </div>
              )}
              {changeSuccess && (
                <div className="bg-green-100 text-green-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-green-200">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  password changed successfully!
                </div>
              )}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Registration Fee Update Modal */}
      {isUpdatingFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Update Registration Fee
            </h2>
            
            <div className="mb-6 bg-blue-50 p-4 rounded-xl">
              <p className="text-gray-700">Current Registration Fee:</p>
              <p className=" text-blue-600">Tk {currentFee}</p>
            </div>
            
            <form onSubmit={handleFeeSubmit} className="space-y-4">
              <div className="relative">
                <label htmlFor="newFee" className="text-sm font-medium text-gray-700 block mb-2">
                  New Registration Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5">Tk</span>
                  <input
                    type="number"
                    id="newFee"
                    value={newFee}
                    onChange={handleFeeChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              {feeUpdateError && (
                <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  {feeUpdateError}
                </div>
              )}
              
              {feeUpdateSuccess && (
                <div className="bg-green-100 text-green-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-green-200">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  Registration fee updated successfully!
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Update Fee"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpdatingFee(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}