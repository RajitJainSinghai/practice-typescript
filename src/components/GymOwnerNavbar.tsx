import { useNavigate } from 'react-router-dom';

interface Props {
  setIsGymOwnerLoggedIn: (value: boolean) => void;
}

const GymOwnerNavbar: React.FC<Props> = ({ setIsGymOwnerLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('gymOwnerId');
    localStorage.removeItem('gymOwnerEmail');
    setIsGymOwnerLoggedIn(false);
    navigate('/gym-owner-login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <span className="text-xl font-bold cursor-pointer" onClick={() => navigate('/gym-owner-dashboard')}>
            Gym Owner Dashboard
          </span>
        </div>
        <div className="flex gap-4">
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default GymOwnerNavbar;
