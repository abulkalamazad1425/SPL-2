import React from 'react'
import { useParams } from 'react-router-dom';

export default function PaymentSuccess() {
    const { tranId } = useParams();
  return (
    <div className="flex justify-center items-center h-screen bg-green-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-green-600 mb-4">Payment Successful</h2>
        <p className="text-lg text-gray-700">Thank you for your payment!</p>
        <div className="mt-4 flex items-center">
            <p className="text-sm text-gray-500 mr-2">Your transaction ID is:</p>
            <p className="text-xs font-medium text-gray-800">{tranId}</p>
        </div>
      </div>
    </div>
  )
}
