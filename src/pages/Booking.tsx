import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadRazorpay } from '../utils/razorpay';
import { GYMS } from './gyms';
import { useAuth } from '../contexts/AuthContext';
import { ID, databases } from '../appwrite/appwrite';

const Booking = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [selectedTrainer, setSelectedTrainer] = React.useState('');

  const gym = GYMS.find((g) => g.id === gymId);

  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  const gymFees = gym?.basePrice || 0;
  const trainerFees = selectedTrainer
    ? gym?.trainers.find((t) => t.id === selectedTrainer)?.price || 0
    : 0;

  const totalBeforeGST = gymFees + trainerFees;
  const gstAmount = totalBeforeGST * 0.18;
  const totalAmount = totalBeforeGST + gstAmount;

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    if (!user) {
      alert('Please login to continue');
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
        name: gym?.name,
        description: 'Gym Booking Payment',
        handler: async (response: any) => {
          console.log('Payment successful:', response);

          try {
            const booking = await databases.createDocument(
              import.meta.env.VITE_APPWRITE_DATABASE_ID,
              import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID,
              ID.unique(),
              {
                gymName: gym?.name,
                gymImage: gym?.image || '', // ✅ Saving gym image
                userId: user?.$id,
                userName: user?.name,
                date: new Date(selectedDate).toISOString(),
                timeSlot: selectedTime,
                paymentStatus: 'confirmed',
                trainerName: selectedTrainer
                  ? gym?.trainers.find((t) => t.id === selectedTrainer)?.name
                  : 'No Trainer',
                paymentAmount: totalAmount.toFixed(2).toString(),
              }
            );

            console.log('Booking saved:', booking);
            navigate('/thank-you');
          } catch (error) {
            console.error('Error saving booking:', error);
            alert('Failed to save booking. Please try again.');
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to process booking');
    }
  };

  if (!gym) return <div>Gym not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={gym.image} alt={gym.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold">{gym.name}</h1>
          <p className="text-gray-600">{gym.description}</p>

          <div className="mt-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border w-full p-2"
            />
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border w-full p-2"
            >
              <option value="">Select time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
            </select>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="border w-full p-2"
            >
              <option value="">No trainer</option>
              {gym.trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name} - {trainer.specialization} (₹{trainer.price}/hour)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleBooking}
            className="bg-blue-500 text-white mt-4 w-full py-2 rounded-md"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
