import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle, Search, DollarSign, User, X } from "lucide-react";

export default function RefundList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundedStudents, setRefundedStudents] = useState(new Set()); // Track refunded students
  const [searchQuery, setSearchQuery] = useState(""); // Stores search input value
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // Store student data for modal

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError("");
      
      try {
        const res = await fetch("/api/manager/get_refund_list");
        const data = await res.json();
        if (data.success) {
          setStudents(data.students);
          setFilteredStudents(data.students);
        } else {
          setError(data.message || "Failed to fetch students");
          setStudents([]);
          setFilteredStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const handleRefund = async (studentId, refundBalance) => {
    try {
      const res = await fetch(`/api/manager/update_refund/${studentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: refundBalance }),
      });
      const data = await res.json();
      if (data.success) {
        setRefundedStudents((prev) => new Set(prev).add(studentId)); // Add to refunded students
        setShowModal(false); // Close modal after successful refund
      } else {
        console.error("Refund failed");
      }
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  };

  // Open modal with student data
  const openRefundModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Filter function based on registration number
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredStudents(students); // Reset list if empty
    } else {
      const filtered = students.filter((student) =>
        student.reg_no.includes(query)
      );
      setFilteredStudents(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Student Refund List
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and process refunds for students with remaining balance
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-md border border-blue-100">
          <div className="flex items-center w-full">
            <label htmlFor="searchStudent" className="font-medium text-gray-700 mr-3">
              Find Student:
            </label>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
              <input
                type="text"
                id="searchStudent"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Enter registration number..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
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
            {filteredStudents.length === 0 && !error ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
                <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-blue-100 mb-6">
                  <DollarSign className="h-12 w-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">No Refunds Pending</h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  There are no students eligible for refund at the moment.
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
                        <th className="py-4 px-4">Phone</th>
                        <th className="py-4 px-4">Balance</th>
                        <th className="py-4 px-4 rounded-r-xl text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
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
                          <td className="py-3 px-4 text-gray-600">{student.phone}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span> Tk </span>
                              <span className="font-medium text-blue-600">{student.balance}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => refundedStudents.has(student._id) ? null : openRefundModal(student)}
                              disabled={refundedStudents.has(student._id)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                                refundedStudents.has(student._id)
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                              }`}
                            >
                              {refundedStudents.has(student._id) ? (
                                <>
                                  <CheckCircle className="inline h-3 w-3 mr-1" />
                                  Refunded
                                </>
                              ) : (
                                "Process Refund"
                              )}
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

        {/* Refund Confirmation Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 relative animate-fadeIn">
              {/* Close button */}
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Modal content */}
              <div className="text-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 inline-flex justify-center items-center mb-4">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Refund</h3>
                <p className="text-gray-600">
                  You are about to process a refund for <span className="font-semibold">{selectedStudent.name}</span>
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-center text-blue-800">
                  Refund Balance: <span className="font-bold text-xl">Tk {selectedStudent.balance}</span>
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRefund(selectedStudent._id, selectedStudent.balance)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-colors"
                >
                  Confirm Refund
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}