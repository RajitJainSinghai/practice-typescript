import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadRazorpay } from '../utils/razorpay';

const SAMPLE_GYMS = [
  {
    id: '1',
    name: 'FitZone Elite',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    description: 'State-of-the-art fitness facility with expert trainers and modern equipment.',
    trainers: [
      { id: '1', name: 'John Smith', specialization: 'Strength Training', price: 50 },
      { id: '2', name: 'Sarah Johnson', specialization: 'HIIT', price: 45 },
      { id: '3', name: 'Mike Wilson', specialization: 'CrossFit', price: 55 },
    ],
  },
  {
    id: '2',
    name: 'PowerHouse Gym',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    description: 'High-end gym with advanced machines and personal training programs.',
    trainers: [
      { id: '1', name: 'Alex Taylor', specialization: 'Bodybuilding', price: 60 },
      { id: '2', name: 'Raju singh', specialization: 'Bodybuilding', price: 120 },
      { id: '3', name: 'Emma Wilson', specialization: 'Yoga', price: 40 },
    ],
  },
  {
    id: '3',
    name: 'CrossFit Central',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    description: 'High-end gym with advanced machines and personal training programs.',
    trainers: [
      { id: '1', name: 'Alex Taylor', specialization: 'Bodybuilding', price: 60 },
      { id: '2', name: 'Emma Wilson', specialization: 'Yoga', price: 40 },
      { id: '3', name: 'buudy Wsing', specialization: 'Yoga', price: 20 },
      { id: '4', name: 'Anshul jain', specialization: 'Yoga', price: 30 },
      { id: '5', name: 'shubh jain', specialization: 'Yoga', price: 70 },
      { id: '6', name: 'jayufg dfyea', specialization: 'Yoga', price: 90 },
    ],
  },
];

const Booking = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [selectedTrainer, setSelectedTrainer] = React.useState('');

  const gym = SAMPLE_GYMS.find((g) => g.id === gymId);

  React.useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('user');
    if (!isLoggedIn) {
      // ✅ Pass the current path to the login page
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      gymName: gym?.name,
      gymImage: gym?.image,
      date: selectedDate,
      time: selectedTime,
      trainer: selectedTrainer
        ? gym?.trainers.find((t) => t.id === selectedTrainer)?.name
        : 'No Trainer',
      status: 'pending',
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = [newBooking, ...existingBookings];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    const res = await loadRazorpay();

    if (!res) {
      alert('Failed to load payment gateway');
      return;
    }

    const options = {
      key: 'rzp_test_zxzai6cmLAtz83',
      amount: (selectedTrainer
        ? gym?.trainers.find((t) => t.id === selectedTrainer)?.price
        : 30) * 100,
      currency: 'INR',
      name: gym?.name,
      description: 'Gym Booking Payment',
      handler: (response: any) => {
        const updatedBookings = JSON.parse(localStorage.getItem('bookings') || '[]').map(
          (booking: any) =>
            booking.id === newBooking.id
              ? { ...booking, status: 'confirmed' }
              : booking
        );
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        navigate('/thank-you');
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
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
                  {trainer.name} - {trainer.specialization} (${trainer.price}/hour)
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