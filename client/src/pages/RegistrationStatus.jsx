import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, User, Clipboard, BookOpen, Calendar, CheckCircle } from "lucide-react";

export default function RegistrationStatus() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUnpaidStudents() {
      try {
        const res = await fetch("/api/manager/unpaid_student");
        const data = await res.json();
        if (data.success === false) {
          setError("Failed to fetch unpaid students");
          setStudents([]);
        } else {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching unpaid students:", error);
        setError("Failed to fetch unpaid students. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchUnpaidStudents();
  }, []);

  const handleUpdateStatus = (studentId) => {
    setSelectedStudent(studentId);
  };

  const handleConfirmUpdate = async () => {
    try {
      const res = await fetch(`/api/payment/update_payment_status/${selectedStudent}`);
      const data = await res.json();
      if (data.success === false) {
        setError("Failed to update status");
        return;
      }
      setStudents(students.filter(student => student._id !== selectedStudent));
      setSelectedStudent(null);
      navigate(0);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Registration Status
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage students with pending registration payments
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center mb-6 shadow-md border border-red-200">
            <AlertCircle className="h-6 w-6 mr-3" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center p-20">
            <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading students...</p>
          </div>
        ) : (
          <>
            {students.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">All Students Registered</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no students with pending registration payments.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-left">
                        <th className="py-4 px-4 rounded-l-xl">Student</th>
                        <th className="py-4 px-4">Registration</th>
                        <th className="py-4 px-4">Department</th>
                        <th className="py-4 px-4">Session</th>
                        <th className="py-4 px-4 rounded-r-xl text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr 
                          key={student._id} 
                          className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-blue-100 mr-3">
                                <User className="h-4 w-4 text-blue-500" />
                              </div>
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Clipboard className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{student.reg_no}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{student.department}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{student.session}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleUpdateStatus(student._id)}
                              className="px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Confirm Registration Payment
            </h3>
            
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to mark this registration fee as paid?
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                onClick={handleConfirmUpdate}
              >
                Confirm
              </button>
              <button
                className="px-6 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 bg-gray-200 hover:bg-gray-300"
                onClick={() => setSelectedStudent(null)}
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