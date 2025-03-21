import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { databases } from '../appwrite/appwrite';

const GymList = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_GYM_COLLECTION_ID
        );
        setGyms(response.documents);
      } catch (error) {
        console.error("Error fetching gyms:", error);
      }
    };

    fetchGyms();
  }, []);

  const handleBookNow = (gym) => {
    if (user) {
      navigate(`/booking/${gym.$id}`);
    } else {
      navigate('/login', { state: { from: `/booking/${gym.$id}` } });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">Find Your Perfect Gym</h1>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gyms.map((gym) => (
          <div 
            key={gym.$id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <img src={gym.image} alt={gym.gymName} className="w-full h-52 object-cover" />
            <div className="p-5">
              <h2 className="text-xl font-bold mb-1 text-gray-900">{gym.gymName}</h2>
              <p className="text-sm text-gray-600 mb-3 truncate">{gym.description}</p>
              <div className="flex justify-between items-center text-gray-800 mb-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  {gym.location}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  6:00 AM - 10:00 PM
                </div>
              </div>
              <div className="flex justify-between items-center font-bold text-lg text-gray-900 mb-4">
                <span>Starting at:</span>
                <span className="text-blue-600">₹{gym.basePrice}</span>
              </div>
              <button
                onClick={() => handleBookNow(gym)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition"
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
