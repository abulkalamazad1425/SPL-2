import React, { useState } from 'react';
import VerifyOtp from '../components/VerifyOtp';
import ResetPassword from '../components/ResetPassword';

export default function ForgetPass() {
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [regNo, setRegNo] = useState('');

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md p-6 rounded-lg">
        {!otpVerified && !passwordReset && (
          <VerifyOtp setOtpVerified={setOtpVerified} setRegNo={setRegNo} />
        )}

        {otpVerified && !passwordReset && (
          <ResetPassword setPasswordReset={setPasswordReset} regNo={regNo} />
        )}

        {passwordReset && (
          <div className="w-full max-w-md p-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-green-600">Password Reset</h2>
                <p className="text-gray-600">Your password has been successfully reset.</p>
                <a 
                  href="/login" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition duration-200"
                >
                  Go to Login
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}