import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Info, 
  LogIn,
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  Menu,
  X,
  Coffee,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!currentUser) {
    return (
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg fixed top-0 w-full z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="p-2 rounded-full bg-white/20 mr-3">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              SHMMS
            </h1>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/about" className="flex items-center py-2 px-3 rounded-xl hover:bg-white/10 transition-all duration-200">
              <Info className="h-5 w-5 mr-2" />
              <span>About</span>
            </Link>
            <Link to="/login" className="flex items-center py-2 px-4 bg-white/15 rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/30">
              <LogIn className="h-5 w-5 mr-2" />
              <span>Login</span>
            </Link>
          </nav>
          
          <button onClick={toggleMenu} className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-blue-600/95 to-purple-600/95 backdrop-blur-sm animate-fadeIn">
            <div className="container mx-auto p-4 py-6">
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/about" 
                    className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all" 
                    onClick={closeMenu}
                  >
                    <Info className="h-5 w-5 mr-3" /> About
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="flex items-center p-3 rounded-xl bg-white/15 hover:bg-white/25 transition-all" 
                    onClick={closeMenu}
                  >
                    <LogIn className="h-5 w-5 mr-3" /> Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="p-2 rounded-full bg-white/20 mr-3">
            <Home className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            SHMMS
          </h1>
        </Link>
        
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="flex items-center py-2 px-3 rounded-xl hover:bg-white/10 transition-all duration-200">
            <Home className="h-5 w-5 mr-2" />
            <span>Home</span>
          </Link>
          <Link to="/profile" className="flex items-center py-2 px-4 bg-white/15 rounded-xl hover:bg-white/25 transition-all duration-200 border border-white/30">
            <User className="h-5 w-5 mr-2" />
            <span>Profile</span>
          </Link>
        </nav>
        
        <button onClick={toggleMenu} className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-600/95 to-purple-600/95 backdrop-blur-sm animate-fadeIn">
          <div className="container mx-auto p-4 py-6">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-all" 
                  onClick={closeMenu}
                >
                  <Home className="h-5 w-5 mr-3" /> Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-xl bg-white/15 hover:bg-white/25 transition-all" 
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 mr-3" /> Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}