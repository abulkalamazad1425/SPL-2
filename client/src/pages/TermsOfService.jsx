import React from 'react';
import { FaBook, FaBalanceScale, FaRegHandshake, FaExclamationCircle } from 'react-icons/fa';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Terms of Service
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read our terms carefully before using our services.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Terms and Conditions</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-blue-100 mr-4 shadow-sm">
                <FaBook className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Acceptance of Terms</h3>
                <p className="text-gray-600">
                  By using our services, you agree to comply with these terms and conditions.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-purple-100 mr-4 shadow-sm">
                <FaBalanceScale className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">User Responsibilities</h3>
                <p className="text-gray-600">
                  You are responsible for maintaining the confidentiality of your account and password.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-pink-100 mr-4 shadow-sm">
                <FaRegHandshake className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Service Agreement</h3>
                <p className="text-gray-600">
                  We reserve the right to modify or discontinue services at any time without notice.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-indigo-100 mr-4 shadow-sm">
                <FaExclamationCircle className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Limitation of Liability</h3>
                <p className="text-gray-600">
                  We are not liable for any indirect, incidental, or consequential damages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}