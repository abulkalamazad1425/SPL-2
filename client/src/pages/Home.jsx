import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaUser, 
  FaInfoCircle, 
  FaHome, 
  FaUtensils, 
  FaMoneyBill, 
  FaCreditCard, 
  FaComment, 
  FaChartPie, 
  FaList, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarker,
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

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);

  // Footer component to maintain consistency
  const SiteFooter = () => (
    <footer className="bg-blue-800 text-white py-8">
      <div className="container mx-auto grid md:grid-cols-3 gap-6 px-6">
        <div>
          <h3 className="font-bold mb-4">About Us</h3>
          <p>Efficient hostel management system designed to simplify administrative tasks and enhance student experience.</p>
        </div>
        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul>
            <li className="flex items-center mb-2">
              <FaPhone className="mr-2" /> +91 9876543210
            </li>
            <li className="flex items-center mb-2">
              <FaEnvelope className="mr-2" /> support@hostelsystem.com
            </li>
            <li className="flex items-center">
              <FaMapMarker className="mr-2" /> Campus Address, City, State
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul>
            <li><Link to="/about" className="hover:text-blue-200">About</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-200">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-200">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-6 border-t border-blue-700 pt-4">
        <p>&copy; 2024 Hostel Management System. All Rights Reserved.</p>
      </div>
    </footer>
  );

  // Before Login View
  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
  

        {/* Body */}
        <main className="flex-grow container mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-6">Welcome to Hostel Management</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our comprehensive system streamlines hostel operations, providing seamless management for students, managers, and administrators. 
              From meal tracking to expense management, we've got everything covered.
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FaUser className="mr-2" /> Login
              </Link>
              <Link 
                to="/registration_verification" 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center"
              >
                <FaUser className="mr-2" /> Register
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/api/placeholder/600/400" 
              alt="Hostel Management" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </main>

        
      </div>
    );
  }

  // After Login View
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Body */}
      <main className="flex-grow container mx-auto p-6 mt-20"> {/* Added mt-20 to account for fixed header */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome, {currentUser.name || 'User'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Common Functionality for All */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <FaBell className="text-blue-600 text-3xl mb-4" />
            <h3 className="font-bold text-xl mb-2">View Notice</h3>
            <p className="text-gray-600 mb-4">Check latest announcements and important notices.</p>
            <Link to="/view_notice" className="text-blue-600 hover:underline">
              View Notices
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <FaChartPie className="text-blue-600 text-3xl mb-4" />
            <h3 className="font-bold text-xl mb-2">Survey</h3>
            <p className="text-gray-600 mb-4">Participate in or view system surveys.</p>
            <Link to="/view_survey" className="text-blue-600 hover:underline">
              View Surveys
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <FaMoneyBill className="text-blue-600 text-3xl mb-4" />
            <h3 className="font-bold text-xl mb-2">Expense</h3>
            <p className="text-gray-600 mb-4">View and track hostel-related expenses.</p>
            <Link to="/view_expense" className="text-blue-600 hover:underline">
              View Expenses
            </Link>
          </div>

          {/* Student Specific Functionality */}
          {currentUser.usertype === 'student' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaUtensils className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Meal Management</h3>
                <p className="text-gray-600 mb-4">Update and track your meal preferences.</p>
                <Link to="/update_mealstatus" className="text-blue-600 hover:underline">
                  Update Meal Status
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaCreditCard className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Payments</h3>
                <p className="text-gray-600 mb-4">Manage hostel-related payments.</p>
                <Link to="/payment" className="text-blue-600 hover:underline">
                  Payment Details
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaComment className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Feedback</h3>
                <p className="text-gray-600 mb-4">Share your thoughts about the hostel.</p>
                <Link to="/give_feedback" className="text-blue-600 hover:underline">
                  Give Feedback
                </Link>
              </div>
            </>
          )}

          {/* Manager Specific Functionality */}
          {currentUser.usertype === 'manager' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaCalendarAlt className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Meal Schedule</h3>
                <p className="text-gray-600 mb-4">Manage and update meal timings.</p>
                <Link to="/update_mealschedule" className="text-blue-600 hover:underline">
                  Update Schedule
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaList className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Student Management</h3>
                <p className="text-gray-600 mb-4">View and manage student meal lists.</p>
                <Link to="/view_meal_list" className="text-blue-600 hover:underline">
                  Student Meal List
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaFileInvoiceDollar className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Expense Management</h3>
                <p className="text-gray-600 mb-4">Upload and track hostel expenses.</p>
                <Link to="/upload_expense" className="text-blue-600 hover:underline">
                  Upload Expense
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaClipboardList className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Create Survey</h3>
                <p className="text-gray-600 mb-4">Design and launch new surveys.</p>
                <Link to="/create_survey" className="text-blue-600 hover:underline">
                  Create Survey
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaClipboardCheck className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Student Feedback</h3>
                <p className="text-gray-600 mb-4">Review and analyze student feedback.</p>
                <Link to="/student_feedback" className="text-blue-600 hover:underline">
                  View Feedback
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaBookOpen className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Refund Management</h3>
                <p className="text-gray-600 mb-4">Manage student refund requests.</p>
                <Link to="/view_refund_list" className="text-blue-600 hover:underline">
                  Refund List
                </Link>
              </div>
            </>
          )}

          {/* Admin Specific Functionality */}
          {currentUser.usertype === 'admin' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <FaUserFriends className="text-blue-600 text-3xl mb-4" />
                <h3 className="font-bold text-xl mb-2">Manager Management</h3>
                <p className="text-gray-600 mb-4">Add and manage hostel managers.</p>
                <Link to="/add_manager" className="text-blue-600 hover:underline">
                  Add Manager
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

  
    </div>
  );
}