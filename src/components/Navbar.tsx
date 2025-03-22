import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Logout user
    navigate('/'); // Redirect to homepage after logout
  };

  // ✅ Function to check active state
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg mb-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ✅ Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Book My Gym</span>
          </Link>

          {/* ✅ Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/gyms"
              className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                isActive('/gyms')
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              Find Gyms
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                    isActive('/profile')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
                <span className="text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg  hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                    isActive('/login')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                    isActive('/register')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
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
          <div className="md:hidden bg-white shadow-md rounded-lg  py-4">
            <div className="flex flex-col space-y-3 px-4">
              <Link
                to="/gyms"
                className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                  isActive('/gyms')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Find Gyms
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                      isActive('/profile')
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
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
                    className="bg-red-500 text-white px-6 py-2 rounded-lg  hover:bg-red-600 transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                      isActive('/login')
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg  transition duration-200 border ${
                      isActive('/register')
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
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
