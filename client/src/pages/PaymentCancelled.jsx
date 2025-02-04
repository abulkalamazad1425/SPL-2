import React from 'react';

export default function PaymentCancelled() {
  return (
    <div className="flex justify-center items-center h-screen bg-yellow-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-yellow-600 mb-4">Payment Cancelled</h2>
        <p className="text-lg text-gray-700">The payment process has been cancelled.</p>
        <p className="mt-4 text-sm text-gray-500">You can choose to try the payment again or contact us for assistance.</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            onClick={() => window.location.reload()} // Or navigate to retry page
          >
            Retry Payment
          </button>
          <button
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={() => window.location.href = '/'} // Redirect to home or dashboard
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
