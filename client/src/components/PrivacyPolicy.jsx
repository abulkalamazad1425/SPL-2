import React from 'react';
import { FaShieldAlt, FaLock, FaUserSecret, FaInfoCircle } from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 text-center shadow-lg border border-blue-100">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Privacy Policy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect your data.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Commitment to Privacy</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-blue-100 mr-4 shadow-sm">
                <FaShieldAlt className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Data Protection</h3>
                <p className="text-gray-600">
                  We use advanced security measures to protect your personal information from unauthorized access.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-purple-100 mr-4 shadow-sm">
                <FaLock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Secure Transactions</h3>
                <p className="text-gray-600">
                  All financial transactions are encrypted to ensure your payment details are safe.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-pink-100 mr-4 shadow-sm">
                <FaUserSecret className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">User Anonymity</h3>
                <p className="text-gray-600">
                  We do not share your personal information with third parties without your consent.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-indigo-100 mr-4 shadow-sm">
                <FaInfoCircle className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Transparency</h3>
                <p className="text-gray-600">
                  We are transparent about how we collect, use, and store your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}