import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Building,
  Calendar,
  Phone,
  CreditCard,
  Lock,
} from "lucide-react";

export default function Registration() {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedData = location.state;
  if (parsedData === null) {
    parsedData.reg_no = "";
    parsedData.email = "";
    parsedData.department = "";
    parsedData.session = "";
    parsedData.hons_year = "";
    parsedData.name='';
  }

  const [formData, setFormData] = useState({
    reg_no: parsedData.reg_no,
    password: "",
    confirmPassword: "",
    name: parsedData.name,
    email: parsedData.email,
    department: parsedData.department,
    session: parsedData.session,
    hons_year: parsedData.hons_year,
    phone: "",
    payment: "offline",
    transactionId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "payment") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.id,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (formData.phone === "") {
      setErrorMessage("Please provide phone number");
      return;
    }
    setErrorMessage("");
    const res = await fetch("/api/reg_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      setErrorMessage("Problem in online payment");
      return;
    }
    window.open(data.url, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    const res = await fetch("/api/student/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      setErrorMessage(data.message);
      return;
    }
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="w-full max-w-2xl p-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500">Register for SHMMS</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Registration Number */}
            <div className="relative">
              <label
                htmlFor="reg_no"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Registration Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="reg_no"
                  readOnly
                  value={formData.reg_no}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div className="relative">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="name"
                  required
                  readOnly
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  readOnly
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50"
                />
              </div>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="department"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Department
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="department"
                    readOnly
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50"
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="session"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Session
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="session"
                    readOnly
                    value={formData.session}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Hon's Year and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="hons_year"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Hon's Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="hons_year"
                    readOnly
                    value={formData.hons_year}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50"
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 block">
                Payment Method
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    id="online"
                    checked={formData.payment === "online"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="online"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Online Payment
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    id="offline"
                    checked={formData.payment === "offline"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="offline"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Offline Payment
                  </label>
                </div>
              </div>

              {formData.payment === "online" && (
                <div className="relative">
                  <label
                    htmlFor="transactionId"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Transaction ID
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="transactionId"
                      required
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {formData.payment === "online" && (
                <button
                  type="button"
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200"
                >
                  Pay Online
                </button>
              )}
              <button
                disabled={
                  formData.payment === "online" && !formData.transactionId
                }
                type="submit"
                className={`w-full py-3 rounded-xl font-medium transition duration-200 ${
                  formData.payment === "online" && !formData.transactionId
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Complete Registration
              </button>
            </div>

            {/* Back to Login Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
