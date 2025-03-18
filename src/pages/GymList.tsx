import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GYMS } from './Gyms';

const GymList = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const handleBookNow = (gym: any) => {
    if (user) {
      navigate(`/booking/${gym.id}`);
    } else {
      // Directly navigate to login with redirect state
      navigate('/login', { state: { from: `/booking/${gym.id}` } });
    }
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Available Gyms</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GYMS.map((gym) => (
          <div key={gym.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={gym.image} alt={gym.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{gym.name}</h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {gym.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  {gym.openHours}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="h-5 w-5 mr-2">₹</span>
                  {gym.basePrice}
                </div>
              </div>
              <button
                onClick={() => handleBookNow(gym)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymList;
