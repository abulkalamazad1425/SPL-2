import React from 'react';

export default function PaymentFailed() {
  return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">Payment Failed</h2>
        <p className="text-lg text-gray-700">Unfortunately, your payment could not be processed.</p>
        <p className="mt-4 text-sm text-gray-500">Please try again or contact support if the issue persists.</p>
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()} // Or navigate to retry page
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
