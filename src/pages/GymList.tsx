import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SAMPLE_GYMS = [
  {
    id: '1',
    name: 'FitZone Elite',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    location: 'Downtown',
    priceRange: '₹ 100',
    rating: 4.8,
    openHours: '6:00 AM - 10:00 PM',
  },
  {
    id: '2',
    name: 'PowerHouse Gym',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    location: 'Westside',
    priceRange: '₹ 120',
    rating: 4.6,
    openHours: '5:00 AM - 11:00 PM',
  },
  {
    id: '3',
    name: 'CrossFit Central',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    location: 'Midtown',
    priceRange: '₹ 140',
    rating: 4.9,
    openHours: '6:00 AM - 9:00 PM',
  },
];

const GymList = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const handleBookNow = (gymId: string) => {
    if (user) {
      // ✅ If logged in, navigate to booking page
      navigate(`/booking/${gymId}`);
    } else {
      // ✅ If not logged in, navigate to register and preserve state
      navigate('/register', { state: { from: `/booking/${gymId}` } });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Available Gyms</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SAMPLE_GYMS.map((gym) => (
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
                  <DollarSign className="h-5 w-5 mr-2" />
                  {gym.priceRange}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">{gym.rating}</span>
                </div>
                <button
                  onClick={() => handleBookNow(gym.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymList;
