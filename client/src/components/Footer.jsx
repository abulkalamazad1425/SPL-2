import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Coffee,
  ChevronRight,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-blue-800 to-purple-800 text-white py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        {/* Top Section with Curved Banner */}
        <div className="bg-gradient-to-r from-blue-700/70 to-purple-700/70 rounded-3xl p-8 mb-10 text-center shadow-lg border border-blue-600/40 backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-100">
              Shahidullah Hall Mess Management
            </span>
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Simplifying administrative tasks and enhancing the student experience
          </p>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* About Section */}
          <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-700/40">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-700/50 mr-3">
                <Heart className="h-5 w-5 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-blue-100">About Us</h3>
            </div>
            <p className="text-blue-200 mb-4">
              This mess management system is designed to simplify administrative tasks and enhance student experience in Shahidullah Hall Mess, providing efficient meal tracking and financial management.
            </p>
            <Link to="/about" className="inline-flex items-center text-blue-200 hover:text-white transition-colors">
              <span>Learn more about us</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* Contact Section */}
          <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-700/40">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-700/50 mr-3">
                <Phone className="h-5 w-5 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-blue-100">Contact</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center text-blue-200">
                <div className="h-8 w-8 rounded-full bg-blue-800/70 flex items-center justify-center mr-3">
                  <Phone className="h-4 w-4" />
                </div>
                <span>01301921242</span>
              </li>
              <li className="flex items-center text-blue-200">
                <div className="h-8 w-8 rounded-full bg-blue-800/70 flex items-center justify-center mr-3">
                  <Phone className="h-4 w-4" />
                </div>
                <span>01788398842</span>
              </li>
              <li className="flex items-center text-blue-200">
                <div className="h-8 w-8 rounded-full bg-blue-800/70 flex items-center justify-center mr-3">
                  <Mail className="h-4 w-4" />
                </div>
                <span>SHMMS@gmail.com</span>
              </li>
              <li className="flex items-center text-blue-200">
                <div className="h-8 w-8 rounded-full bg-blue-800/70 flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Shahidullah Hall, Dhaka University</span>
              </li>
            </ul>
          </div>
          
          {/* Quick Links Section */}
          <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-700/40">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-700/50 mr-3">
                <ExternalLink className="h-5 w-5 text-blue-200" />
              </div>
              <h3 className="text-xl font-bold text-blue-100">Quick Links</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy_policy" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms_of_service" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center text-blue-200 hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          <a href="#" className="h-10 w-10 rounded-full bg-blue-700/50 flex items-center justify-center hover:bg-blue-600 transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="h-10 w-10 rounded-full bg-blue-700/50 flex items-center justify-center hover:bg-blue-600 transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="h-10 w-10 rounded-full bg-blue-700/50 flex items-center justify-center hover:bg-blue-600 transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="h-10 w-10 rounded-full bg-blue-700/50 flex items-center justify-center hover:bg-blue-600 transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
        
        {/* Copyright Section */}
        <div className="text-center border-t border-blue-700/50 pt-6">
          <div className="flex justify-center items-center mb-4">
            <div className="p-2 rounded-full bg-blue-700/30 mr-3">
              <Coffee className="h-5 w-5 text-blue-300" />
            </div>
            <span className="text-lg font-semibold text-blue-200">SHMMS</span>
          </div>
          <p className="text-blue-300">&copy; {currentYear} Shahidullah Hall Mess Management System - All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}