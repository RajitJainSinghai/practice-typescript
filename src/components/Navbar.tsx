import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Logout user
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ✅ Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">GymBook</span>
          </Link>

          {/* ✅ Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/gyms" className="text-gray-600 hover:text-blue-600">
              Find Gyms
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
                <span className="text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ✅ Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md rounded-md py-4">
            <div className="flex flex-col space-y-3 px-4">
              <Link
                to="/gyms"
                className="text-gray-600 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Find Gyms
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
