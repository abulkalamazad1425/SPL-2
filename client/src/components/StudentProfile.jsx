import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Phone, BookOpen, Calendar, CreditCard, User, Edit2, CheckCircle, Upload, Lock, ClipboardList, LogOut, FileText, CreditCard as PaymentIcon } from 'lucide-react';
import { updateProfileSuccess, logOutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    hons_year: currentUser?.hons_year || '',
  });
  const [photoPreview, setPhotoPreview] = useState(`http://localhost:3000/${currentUser.photo}`);
  const [photoFile, setPhotoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false); // State for password change modal
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isApplyingLeave, setIsApplyingLeave] = useState(false);
  const [leaveError, setLeaveError] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
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
  const handleLeaveSubmit = async () => {
    setLeaveError('');
    setLeaveSuccess(false);

    try {
      const response = await fetch(`/api/student/apply_leave/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success === false) {
        setLeaveError(data.message);
        throw new Error(data.message || 'Failed to apply for leave');
      }

      setLeaveSuccess(true);
      setTimeout(() => {
        setIsApplyingLeave(false);
        setLeaveSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error applying for leave:', err);
      setLeaveError(err.message || 'Something went wrong. Please try again.');
    }
  }
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/log_out');

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || 'Logout failed');
      }

      // Clear user state in Redux
      dispatch(logOutSuccess());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Optionally show an error message
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Student Profile
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
                  alt="Student Profile"
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

                  {/* Honors Year Input */}
                  <div className="relative">
                    <label htmlFor="hons_year" className="text-sm font-medium text-gray-700 block mb-2">
                      Honors Year
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                      <input
                        type="text"
                        id="hons_year"
                        value={formData.hons_year}
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
                  {/* Student Details */}
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
                        <BookOpen className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registration No</p>
                        <p className="font-medium text-gray-800">{currentUser?.reg_no}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-blue-50/50 p-4 rounded-xl">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium text-gray-800">{currentUser?.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-blue-50/50 p-4 rounded-xl">
                      <div className="p-2 rounded-full bg-blue-100 mr-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Honors Year</p>
                        <p className="font-medium text-gray-800">{currentUser?.hons_year}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Balance</p>
                    <p className="font-medium text-gray-800">Tk {currentUser?.balance || '0.00'}</p>
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

        {/* Academic Information */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Academic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Session</p>
                  <p className="font-medium text-gray-800">{currentUser?.session}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{currentUser?.department}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Payment Status</p>
                  <p className="font-medium text-gray-800">{currentUser?.reg_payment}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium text-gray-800">
                    {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions Section - Fixed styling to match other sections */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Additional Actions
          </h2>
          
          <div className="space-y-4">
            {/* Meal History Button */}
            <button
              onClick={() => {navigate(`/meal_history/${currentUser._id}`)}}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center"
            >
              <ClipboardList className="h-6 w-6 mr-3" />
              View Meal History
            </button>

            {/* Payment History Button */}
            <button
              onClick={() => {navigate(`/payment_history/${currentUser._id}`)}}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center"
            >
              <PaymentIcon className="h-6 w-6 mr-3" />
              View Payment History
            </button>

            {/* Apply Leave Button */}
            <button
              onClick={() => setIsApplyingLeave(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center"
            >
              <FileText className="h-6 w-6 mr-3" />
              Apply Leave
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 rounded-xl font-medium transition duration-200 flex items-center justify-center"
            >
              <LogOut className="h-6 w-6 mr-3" />
              Log out
            </button>
          </div>
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
      {isApplyingLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <FileText className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Apply for Leave
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to apply for leave?
            </p>

            {leaveError && (
              <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
                <CheckCircle className="h-6 w-6 mr-3" />
                {leaveError}
              </div>
            )}
            {leaveSuccess && (
              <div className="bg-green-100 text-green-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-green-200">
                <CheckCircle className="h-6 w-6 mr-3" />
                Leave application submitted successfully!
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleLeaveSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition duration-200 flex justify-center items-center"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsApplyingLeave(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

