import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

interface Props {
  setIsGymOwnerLoggedIn: (value: boolean) => void;
  isGymOwnerLoggedIn: boolean;
}

const GymOwnerNavbar = ({ setIsGymOwnerLoggedIn, isGymOwnerLoggedIn }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('gymOwnerId');
    setIsGymOwnerLoggedIn(false);
    navigate('/gym-owner-login');
  };

  // ✅ Function to check active state
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* ✅ Logo + Title */}
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-10 w-10 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">Book My Gym</span>
          </div>

          {/* ✅ Right Side Buttons */}
          <div className="flex items-center space-x-4">
            
            {isGymOwnerLoggedIn ? (
              <>
                {/* ✅ Dashboard Button */}
                <Link
                  to="/gym-owner-dashboard"
                  className={`px-6 py-2 rounded-lg  transition duration-200 border ${
                    isActive('/gym-owner-dashboard')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>

                {/* ✅ Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg  hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* ✅ Login Button */}
                <button
                  onClick={() => navigate('/gym-owner-login')}
                  className={`px-6 py-2 rounded-lg  transition duration-200 border ${
                    isActive('/gym-owner-login')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  Login
                </button>

                {/* ✅ Register Button */}
                <button
                  onClick={() => navigate('/gym-owner-register')}
                  className={`px-6 py-2 rounded-lg  transition duration-200 border ${
                    isActive('/gym-owner-register')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GymOwnerNavbar;
