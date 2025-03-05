// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaUser, 
  FaInfoCircle, 
  FaHome, 
  FaBell,
  FaClipboardList,
  FaBook,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaUserFriends,
  FaBookOpen,
  FaClipboardCheck,
  FaChalkboardTeacher
} from 'react-icons/fa';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return (
      <header className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center">
            <span role="img" aria-label="Hostel" className="text-3xl mr-3">🏠</span>
            <h1 className="text-2xl font-bold text-blue-800">Hostel Management System</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/about" className="text-blue-600 hover:text-blue-800 flex items-center">
                  <FaInfoCircle className="mr-1" /> About
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-blue-600 hover:text-blue-800 flex items-center">
                  <FaUser className="mr-1" /> Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span role="img" aria-label="Hostel" className="text-2xl mr-2">🏠</span>
          <h1 className="text-2xl font-bold">Hostel Management System</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-200 flex items-center">
                <FaHome className="mr-1" /> Home
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-blue-200 flex items-center">
                <FaUser className="mr-1" /> Profile
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-200 flex items-center">
                <FaInfoCircle className="mr-1" /> About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}