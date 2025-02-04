import React, { useState } from 'react';
import { ArrowRight, User, ShieldCheck, Key } from 'lucide-react';

export default function VerifyOtp({ setOtpVerified, setRegNo }) {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [otpMatchMessage, setOtpMatchMessage] = useState(null);
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
      if(e.target.id === 'reg_no'){
        setRegNo(e.target.value);
      }
    };
  
    const verifyRegNo = async (e) => {
      e.preventDefault();
      const res = await fetch('/api/student/reg_verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setMessage(data.message);
        return;
      }
      setOtpSent(true);
      setMessage(data.message);
    };
  
    const verify_otp = async (e) => {
      e.preventDefault();
      const res = await fetch('/api/student/otp_verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setOtpMatchMessage(data.message);
        return;
      }
      setOtpVerified(true);
    };
  
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2 flex flex-col items-center">
              <ShieldCheck className="text-blue-600 w-16 h-16 mb-4" />
              <h1 className="text-3xl font-bold text-gray-800">OTP Verification</h1>
              <p className="text-gray-500">Please verify your registration number</p>
            </div>
  
            <form onSubmit={verify_otp} className="space-y-5">
              <div className="space-y-4">
                <div className='relative'>
                  <label htmlFor="reg_no" className="text-sm font-medium text-gray-700 block mb-2">
                    Registration Number
                  </label>
                  <div className='relative'>
                    <User className='absolute top-3 left-3 text-gray-400' />
                    <input
                      type="text"
                      id="reg_no"
                      placeholder="Enter Registration Number"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
  
                <button
                  type="button"
                  onClick={verifyRegNo}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Verify Registration Number</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
  
                {message && (
                  <p className={`mt-4 text-center text-sm ${message === 'OTP sent successfully' ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
  
                {otpSent && (
                  <>
                    <div className='relative'>
                      <label htmlFor="otp" className="text-sm font-medium text-gray-700 block mb-2">
                        OTP
                      </label>
                      <div className='relative'>
                        <Key className='absolute top-3 left-3 text-gray-400' />
                        <input
                          type="text"
                          id="otp"
                          placeholder="Enter OTP"
                          onChange={handleChange}
                          required
                          className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </div>
  
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center space-x-2 group"
                    >
                      <span>Verify OTP</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </>
                )}
              </div>
            </form>
  
            {otpMatchMessage && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm text-center">
                {otpMatchMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    );
}