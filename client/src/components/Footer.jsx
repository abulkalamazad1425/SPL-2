// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarker 
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-8">
      <div className="container mx-auto grid md:grid-cols-3 gap-6 px-6">
        <div>
          <h3 className="font-bold mb-4">About Us</h3>
          <p>Efficient hostel management system designed to simplify administrative tasks and enhance student experience.</p>
        </div>
        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul>
            <li className="flex items-center mb-2">
              <FaPhone className="mr-2" /> +91 9876543210
            </li>
            <li className="flex items-center mb-2">
              <FaEnvelope className="mr-2" /> support@hostelsystem.com
            </li>
            <li className="flex items-center">
              <FaMapMarker className="mr-2" /> Campus Address, City, State
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul>
            <li><Link to="/about" className="hover:text-blue-200">About</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-200">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-200">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-6 border-t border-blue-700 pt-4">
        <p>&copy; 2024 Hostel Management System. All Rights Reserved.</p>
      </div>
    </footer>
  );
}