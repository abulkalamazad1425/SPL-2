import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Building,
  Calendar,
  Phone,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Clock
} from "lucide-react";

export default function Registration() {
  const navigate = useNavigate();
  const { hallId } = useParams();
  const [hallInformation, setHallInformation] = useState({});
  const [formData, setFormData] = useState({
    reg_no: "",
    name: "",
    email: "",
    department: "",
    session: "",
    hons_year: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [studentId, setStudentId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    async function fetchHallData() {
      setIsDataLoading(true);
      try {
        const res = await fetch(`/api/student/hall_data/${hallId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setErrorMessage("Failed to load student data. Please try again.");
          return;
        }
        setHallInformation(data);
        setFormData(prev => ({
          ...prev,
          reg_no: data.reg_no || "",
          name: data.name || "",
          email: data.email || "",
          department: data.department || "",
          session: data.session || "",
          hons_year: data.hons_year || ""
        }));
      } catch (error) {
        console.log(error);
        setErrorMessage("Connection error. Please try again later.");
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchHallData();
  }, [hallId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (formData.phone === "") {
      setErrorMessage("Please provide phone number");
      setIsLoading(false);
      return;
    }

    setErrorMessage("");

    try {
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
        setIsLoading(false);
        return;
      }

      // Show payment modal on successful registration
      setRegistrationMessage(data.message || "Registration Successful!");
      setStudentId(data.student._id);
      setPaymentId(data.payment._id);
      setShowPaymentModal(true);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handlePayNow = async () => {
    try {
      const res = await fetch(`/api/student/registration_payment?studentId=${studentId}&paymentId=${paymentId}`);
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage("Problem with online payment");
        return;
      }
      window.open(data.url);
    } catch (error) {
      setErrorMessage("Payment initiation failed");
    }
  };

  const handlePayLater = () => {
    navigate("/login");
  };

  // Function to get all form fields in consistent styling
  const formField = (id, label, icon, placeholder, value, onChange, type = "text", isReadOnly = false) => (
    <div className="relative">
      <label htmlFor={id} className="font-medium text-gray-700 block mb-2">
        {label}
      </label>
      <div className="relative">
        {icon}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={isReadOnly}
          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isReadOnly ? 'bg-gray-50' : ''}`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Student Registration
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your profile to access SHMMS services
          </p>
        </div>

        {/* Loading State */}
        {isDataLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-blue-100">
            <div className="flex flex-col justify-center items-center">
              <Loader2 className="animate-spin h-14 w-14 text-blue-500 mb-4" />
              <p className="text-blue-600 text-lg font-medium animate-pulse">Loading student data...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Registration Number and Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formField(
                  "reg_no",
                  "Registration Number",
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Registration Number",
                  formData.reg_no,
                  handleChange,
                  "text",
                  true
                )}
                
                {formField(
                  "name",
                  "Full Name",
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Full Name",
                  formData.name,
                  handleChange,
                  "text",
                  true
                )}
              </div>

              {/* Email */}
              {formField(
                "email",
                "Email Address",
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                "Email Address",
                formData.email,
                handleChange,
                "email",
                true
              )}

              {/* Department and Session */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formField(
                  "department",
                  "Department",
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Department",
                  formData.department,
                  handleChange,
                  "text",
                  true
                )}
                
                {formField(
                  "session",
                  "Session",
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Session",
                  formData.session,
                  handleChange,
                  "text",
                  true
                )}
              </div>

              {/* Hon's Year and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formField(
                  "hons_year",
                  "Hon's Year",
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Hon's Year",
                  formData.hons_year,
                  handleChange,
                  "text",
                  true
                )}
                
                {formField(
                  "phone",
                  "Phone Number",
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Enter your phone number",
                  formData.phone,
                  handleChange,
                  "tel",
                  false
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formField(
                  "password",
                  "Password",
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Create a password",
                  formData.password,
                  handleChange,
                  "password",
                  false
                )}
                
                {formField(
                  "confirmPassword",
                  "Confirm Password",
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />,
                  "Confirm your password",
                  formData.confirmPassword,
                  handleChange,
                  "password",
                  false
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center border border-red-200">
                  <AlertCircle className="h-6 w-6 mr-3" />
                  {errorMessage}
                </div>
              )}

              {/* Register Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Register Account"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fadeIn">
            <div className="text-center mb-6">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
                  Registration Complete!
                </span>
              </h2>
              <p className="text-gray-600">{registrationMessage}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-medium text-blue-700 mb-2 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Complete Payment
                </h3>
                <p className="text-blue-600 text-sm">
                  To activate your account, please complete the registration payment now or later from your account.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handlePayNow}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay Now
              </button>
              
              <button
                onClick={handlePayLater}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
              >
                <Clock className="h-5 w-5 mr-2" />
                Pay Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}