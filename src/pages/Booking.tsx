import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadRazorpay } from '../utils/razorpay';
import { GYMS } from './gyms';

const Booking = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [selectedTrainer, setSelectedTrainer] = React.useState('');

  // ✅ Fetch gym from imported GYMS data
  const gym = GYMS.find((g) => g.id === gymId);

  React.useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('user');
    if (!isLoggedIn) {
      // ✅ Redirect to login if user is not logged in
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  // Calculate gym and trainer fees
  const gymFees = gym?.basePrice || 0;
  const trainerFees = selectedTrainer
    ? gym?.trainers.find((t) => t.id === selectedTrainer)?.price || 0
    : 0;

  // Calculate total before GST and GST amount
  const totalBeforeGST = gymFees + trainerFees;
  const gstAmount = totalBeforeGST * 0.18;
  const totalAmount = totalBeforeGST + gstAmount;

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
      amount: totalAmount * 100, // Amount in paise (INR)
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
                  {trainer.name} - {trainer.specialization} (₹{trainer.price}/hour)
                </option>
              ))}
            </select>
          </div>

          {/* Cart Breakdown Table */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Booking Details</h2>
            <table className="table-auto w-full mt-4 text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-gray-600">Item</th>
                  <th className="py-2 px-4 text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-700">Gym Fees</td>
                  <td className="py-2 px-4 text-gray-700">₹{gymFees}</td>
                </tr>
                {selectedTrainer && (
                  <tr className="border-b">
                    <td className="py-2 px-4 text-gray-700">Trainer Fees</td>
                    <td className="py-2 px-4 text-gray-700">₹{trainerFees}</td>
                  </tr>
                )}
                <tr className="border-b">
                  <td className="py-2 px-4 font-semibold text-gray-700">Total (before GST)</td>
                  <td className="py-2 px-4 font-semibold text-gray-700">₹{totalBeforeGST}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 text-gray-700">18% GST</td>
                  <td className="py-2 px-4 text-gray-700">₹{gstAmount.toFixed(2)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-bold text-gray-800">Total Amount</td>
                  <td className="py-2 px-4 font-bold text-gray-800">₹{totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Proceed to Payment Button */}
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
