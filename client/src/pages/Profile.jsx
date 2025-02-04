import React from 'react'
import { useSelector } from 'react-redux';

export default function Profile() {
    const {currentUser} = useSelector((state) => state.user);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Student Profile</h1>
      
      <div className="flex items-center justify-center bg-white p-6 rounded-lg shadow-lg">
        {/* Student Photo */}
        <div className="flex-shrink-0">
          <img
            src={currentUser.photo || '/default-profile-photo.jpg'} 
            alt="Student Profile"
            className="w-40 h-40 object-cover rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Student Info */}
        <div className="ml-6">
          <h2 className="text-2xl font-semibold text-gray-800">{currentUser.name}</h2>
          <p className="mt-2 text-lg text-gray-600"><strong>Email:</strong> {currentUser.email}</p>
          <p className="mt-2 text-lg text-gray-600"><strong>Registration No:</strong> {currentUser.reg_no}</p>
          <p className="mt-2 text-lg text-gray-600"><strong>Honors Year:</strong> {currentUser.hons_year}</p>
          <p className="mt-2 text-lg text-gray-600"><strong>Mobile:</strong> {currentUser.phone}</p>
        </div>
      </div>
    </div>
  )
}
