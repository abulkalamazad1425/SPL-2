import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle, User, DollarSign, FileText } from "lucide-react";

export default function ResignView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refundAmount, setRefundAmount] = useState(null);

  useEffect(() => {
    async function fetchLeaveApplications() {
      setLoading(true);
      setError("");
      
      try {
        const res = await fetch("/api/manager/leave_application");
        const data = await res.json();
        
        if (data.success === false) {
          setError("Failed to fetch leave applications");
          setStudents([]);
        } else {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching leave applications:", error);
        setError("Failed to fetch leave applications. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaveApplications();
  }, []);

  const handleRemoveStudent = async (studentId) => {
    try {
      const res = await fetch(`/api/student/get_leave_refund/${studentId}`);
      const data = await res.json();
      
      if (data.success === false) {
        setError("Failed to fetch refund amount");
        return;
      } 
      
      setSelectedStudent(studentId);
      setRefundAmount(data);
    } catch (error) {
      console.error("Error fetching refund amount:", error);
      setError("Failed to calculate refund amount. Please try again.");
    }
  };

  const handleConfirmRemoval = async () => {
    try {
      const res = await fetch(`/api/manager/remove_student/${selectedStudent}`);
      
      const data = await res.json();
      
      if (data.success === false) {
        setError("Failed to remove student");
        return;
      }
      
      setStudents(students.filter(student => student._id !== selectedStudent));
      setSelectedStudent(null);
      setRefundAmount(null);
    } catch (error) {
      console.error("Error removing student:", error);
      setError("Failed to remove student. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Student Leave Applications
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and process student leave requests and refunds
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
            <p className="text-blue-600 text-lg font-medium animate-pulse">Loading applications...</p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-white rounded-3xl p-6 mb-8 shadow-md border border-blue-100">
              <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Total Applications Count */}
                <div className="flex items-center bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-blue-700 font-medium">Total Applications</div>
                    <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                  </div>
                </div>
                
                <div className="flex-grow text-center">
                  <p className="text-gray-600">
                    Review and process student leave applications. Confirming a student's removal will calculate the refund amount.
                  </p>
                </div>
              </div>
            </div>

            {students.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <FileText className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Applications Found</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no pending leave applications at the moment.
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
                          <td className="py-3 px-4 text-gray-600">{student.reg_no}</td>
                          <td className="py-3 px-4">{student.department}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveStudent(student._id)}
                              className="px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                            >
                              Remove Student
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 max-w-md w-full">
            <div className="text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Confirm Student Removal</h3>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">You are about to remove this student and process their refund.</p>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Total Refund Amount</p>
                  <p className="text-3xl font-bold text-blue-800">Tk {refundAmount}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                  onClick={handleConfirmRemoval}
                >
                  Confirm Removal
                </button>
                <button
                  className="px-6 py-3 rounded-xl text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                  onClick={() => setSelectedStudent(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}