import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  User, 
  Utensils, 
  DollarSign, 
  CreditCard, 
  MessageSquare, 
  PieChart, 
  List, 
  Bell,
  ClipboardList,
  Calendar,
  FileText,
  Users,
  BookOpen,
  CheckSquare,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Shaidullah Hall Mess Management System
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive system streamlines hostel operations, providing seamless management for students, managers, and administrators.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to SHMMS</h2>
            <p className="text-lg text-gray-600 mb-6">
              From meal tracking to expense management, we've got everything covered for a seamless hostel experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-md transition flex items-center"
              >
                <LogIn className="mr-2 h-5 w-5" /> Login
              </Link>
              <Link 
                to="/registration_verification" 
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-md transition flex items-center"
              >
                <UserPlus className="mr-2 h-5 w-5" /> Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // After Login View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Welcome, {currentUser.name || 'User'}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your hostel experience with our comprehensive dashboard
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Common Functionality for All */}
          <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-blue-100">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-2xl bg-blue-100 mr-4">
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 pt-2">View Notice</h2>
              </div>
              <div className="rounded-2xl bg-blue-50 p-5 mb-4">
                <p className="text-gray-700">Check latest announcements and important notices.</p>
              </div>
              <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                <Link to="/view_notice" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View Notices <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-purple-100">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-2xl bg-purple-100 mr-4">
                  <PieChart className="h-5 w-5 text-purple-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 pt-2">Survey</h2>
              </div>
              <div className="rounded-2xl bg-purple-50 p-5 mb-4">
                <p className="text-gray-700">Participate in or view system surveys.</p>
              </div>
              <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                <Link to="/view_survey" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                  View Surveys <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-pink-100">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-2xl bg-pink-100 mr-4">
                  <DollarSign className="h-5 w-5 text-pink-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 pt-2">Expense</h2>
              </div>
              <div className="rounded-2xl bg-pink-50 p-5 mb-4">
                <p className="text-gray-700">View and track hostel-related expenses.</p>
              </div>
              <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                <Link to="/view_expense" className="text-pink-600 hover:text-pink-800 font-medium flex items-center">
                  View Expenses <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Student Specific Functionality */}
          {currentUser.usertype === 'student' && (
            <>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-indigo-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-100 mr-4">
                      <Utensils className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Meal Management</h2>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 p-5 mb-4">
                    <p className="text-gray-700">Update and track your meal preferences.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/update_mealstatus" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      Update Meal Status <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div> 
            <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-cyan-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-cyan-100 mr-4">
                      <CreditCard className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Payments</h2>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-5 mb-4">
                    <p className="text-gray-700">Manage hostel-related payments.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/payment" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center">
                      Payment Details <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-blue-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-blue-100 mr-4">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Feedback</h2>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-5 mb-4">
                    <p className="text-gray-700">Share your thoughts about the hostel.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/give_feedback" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Give Feedback <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Manager Specific Functionality */}
          {currentUser.usertype === 'manager' && (
            <>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-indigo-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-100 mr-4">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Meal Schedule</h2>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 p-5 mb-4">
                    <p className="text-gray-700">Manage and update meal timings.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/update_mealschedule" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      Update Schedule <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-cyan-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-cyan-100 mr-4">
                      <List className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Student Management</h2>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-5 mb-4">
                    <p className="text-gray-700">View and manage student meal lists.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/view_meal_list" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center">
                      Student Meal List <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-cyan-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-cyan-100 mr-4">
                      <User className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Deregester View</h2>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-5 mb-4">
                    <p className="text-gray-700">Manage Deregester applied students.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/resign_view" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center">
                      Deregester Student <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-cyan-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-cyan-100 mr-4">
                      <CreditCard className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Offline Registration</h2>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-5 mb-4">
                    <p className="text-gray-700">Update student registration (offline).</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/unregistered_student" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center">
                      Register Student <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-cyan-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-cyan-100 mr-4">
                      <CreditCard className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Notice</h2>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-5 mb-4">
                    <p className="text-gray-700">Notify Student Through Notice</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/upload_notice" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center">
                      Post Notice <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-purple-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-purple-100 mr-4">
                      <ClipboardList className="h-5 w-5 text-purple-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Create Survey</h2>
                  </div>
                  <div className="rounded-2xl bg-purple-50 p-5 mb-4">
                    <p className="text-gray-700">Design and launch new surveys.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/create_survey" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                      Create Survey <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-cyan-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-cyan-100 mr-4">
                      <DollarSign className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Student Meal Payment</h2>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-5 mb-4">
                    <p className="text-gray-700">Update student meal payment (offline).</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/meal_payment" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center">
                      Update Payment <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-pink-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-pink-100 mr-4">
                      <FileText className="h-5 w-5 text-pink-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Expense Management</h2>
                  </div>
                  <div className="rounded-2xl bg-pink-50 p-5 mb-4">
                    <p className="text-gray-700">Upload and track hostel expenses.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/upload_expense" className="text-pink-600 hover:text-pink-800 font-medium flex items-center">
                      Upload Expense <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-blue-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-blue-100 mr-4">
                      <CheckSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Student Feedback</h2>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-5 mb-4">
                    <p className="text-gray-700">Review and analyze student feedback.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/student_feedback" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      View Feedback <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-indigo-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-indigo-100 mr-4">
                      <BookOpen className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Refund Management</h2>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 p-5 mb-4">
                    <p className="text-gray-700">Manage student refund requests.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/view_refund_list" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      Refund List <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Admin Specific Functionality */}
          {currentUser.usertype === 'admin' && (
            <>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-cyan-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-cyan-100 mr-4">
                      <Users className="h-5 w-5 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Manager Management</h2>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-5 mb-4">
                    <p className="text-gray-700">Add and manage hostel managers.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/add_manager" className="text-cyan-600 hover:text-cyan-800 font-medium flex items-center">
                      Add Manager <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border border-purple-100">
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-2xl bg-purple-100 mr-4">
                      <ClipboardList className="h-5 w-5 text-purple-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 pt-2">Create Survey</h2>
                  </div>
                  <div className="rounded-2xl bg-purple-50 p-5 mb-4">
                    <p className="text-gray-700">Design and launch new surveys.</p>
                  </div>
                  <div className="flex justify-end mt-3 border-t border-gray-200 pt-3">
                    <Link to="/create_survey" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                      Create Survey <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}