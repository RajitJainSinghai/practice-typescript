import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadRazorpay } from '../utils/razorpay';
import { useAuth } from '../contexts/AuthContext';
import { ID, databases } from '../appwrite/appwrite';

const Booking = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [gym, setGym] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [trainerFees, setTrainerFees] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    const fetchGym = async () => {
      try {
        const response = await databases.getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_GYM_COLLECTION_ID,
          gymId
        );
        setGym(response);
      } catch (error) {
        console.error('Error fetching gym:', error);
      }
    };
    
    fetchGym();
  }, [user, navigate, location.pathname, gymId]);

  if (!gym) return <div>Loading...</div>;

  const trainers = gym.trainers 
    ? JSON.parse(gym.trainers).map((trainer, index) => ({
        id: index + 1,  
        ...trainer
      })) 
    : [];

  const gymFees = gym.basePrice || 0;
  const gstAmount = gymFees * 0.18;
  const totalAmount = gymFees + trainerFees + gstAmount;

  const handleTrainerChange = (e) => {
    const trainer = trainers.find(t => t.id.toString() === e.target.value) || null;
    setSelectedTrainer(trainer ? trainer.id.toString() : '');
    setTrainerFees(trainer ? Number(trainer.price) : 0);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    try {
      const res = await loadRazorpay();
      if (!res) {
        alert('Failed to load payment gateway');
        return;
      }

      const options = {
        key: 'rzp_test_zxzai6cmLAtz83',
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        name: gym.gymName,
        description: 'Gym Booking Payment',
        handler: async (response) => {
          try {
            await databases.createDocument(
              import.meta.env.VITE_APPWRITE_DATABASE_ID,
              import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID,
              ID.unique(),
              {
                gymId: gym.$id,
                gymName: gym.gymName,
                gymImage: gym.image || '',
                userId: user.$id,
                userName: user.name,
                date: new Date(selectedDate).toISOString(),
                timeSlot: selectedTime,
                paymentStatus: 'confirmed',
                trainerName: selectedTrainer ? (trainers.find(t => t.id.toString() === selectedTrainer)?.name || 'No Trainer') : 'No Trainer',
                paymentAmount: totalAmount.toFixed(2).toString(),
              }
            );
            navigate('/thank-you');
          } catch (error) {
            console.error('Error saving booking:', error);
            alert('Failed to save booking. Please try again.');
          }
        },
        prefill: { email: user.email },
        theme: { color: '#3399cc' },
      };

      const paymentObject = new (window).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to process booking');
    }
  };

  const timeSlots = [
    { time: '05:00 AM - 05:55 AM', label: 'Morning' },
    { time: '06:00 AM - 06:55 AM', label: 'Morning' },
    { time: '07:00 AM - 07:55 AM', label: 'Morning' },
    { time: '08:00 AM - 08:55 AM', label: 'Morning' },
    { time: '09:00 AM - 09:55 AM', label: 'Morning' },
    { time: '10:00 AM - 10:55 AM', label: 'Morning' },
    { time: '11:00 AM - 11:55 AM', label: 'Morning' },
    { time: '12:00 PM - 12:55 PM', label: 'Afternoon' },
    { time: '01:00 PM - 01:55 PM', label: 'Afternoon' },
    { time: '02:00 PM - 02:55 PM', label: 'Afternoon' },
    { time: '03:00 PM - 03:55 PM', label: 'Afternoon' },
    { time: '04:00 PM - 04:55 PM', label: 'Afternoon' },
    { time: '05:00 PM - 05:55 PM', label: 'Afternoon' },
    { time: '06:00 PM - 06:55 PM', label: 'Evening' },
    { time: '07:00 PM - 07:55 PM', label: 'Evening' },
    { time: '08:00 PM - 08:55 PM', label: 'Evening' },
    { time: '09:00 PM - 09:55 PM', label: 'Evening' },
    { time: '10:00 PM - 10:55 PM', label: 'Evening' },
    { time: '11:00 PM - 11:55 PM', label: 'Evening' },
];


  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={gym.image} alt={gym.gymName} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">{gym.gymName}</h1>
          <p className="text-gray-600">{gym.description}</p>
          <div className="mt-4 space-y-3">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border w-full p-2 rounded-md" />
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="border w-full p-2 rounded-md">
              <option value="">Select time</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot.time}>{slot.time} ({slot.label})</option>
              ))}
            </select>

            <select value={selectedTrainer} onChange={handleTrainerChange} className="border w-full p-2 rounded-md">
              <option value="">No trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id.toString()}>
                  {trainer.name} - ₹{trainer.price}/hour
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700">Payment Summary</h3>
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Gym Fees:</span>
              <span>₹{gymFees}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-1">
              <span>Trainer Fees:</span>
              <span>₹{trainerFees}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-1">
              <span>GST (18% on Gym Fees):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 mt-2">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleBooking} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition">
            Proceed to Payment
          </button>
        </div>
          </div>
        </div>
  );
};

export default Booking;
