import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { databases } from '../appwrite/appwrite';
import { Query } from 'appwrite';
import { GYMS } from './gyms';

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user) {
          const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID,
            [Query.equal('userId', user.$id)]
          );
          setBookings(response.documents.reverse());
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, [user]);

  if (bookings.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No bookings available.
      </div>
    );
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
        Your Bookings
      </h2>

      {/* ✅ Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.slice(0, 5).map((booking, index) => {
          // Get gym details from GYMS list
          const gym = GYMS.find((g) => g.name === booking.gymName);
          const gymFees = gym?.basePrice || 0;

          // Find trainer fees based on selected trainer
          const trainerFees = gym?.trainers.find(
            (t) => t.name === booking.trainerName
          )?.price || 0;

          // GST calculation only on gym fees
          const gstAmount = gymFees * 0.18;
          const totalAmount = gymFees + trainerFees + gstAmount;

          return (
            <div
              key={booking.$id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* ✅ Gym Image */}
              <img
                src={booking.gymImage || '/default-gym.jpg'}
                alt={booking.gymName || 'Gym'}
                className="w-full h-48 object-cover"
                onError={(e) => (e.currentTarget.src = '/default-gym.jpg')}
              />
              <div className="p-4">
                {/* ✅ Gym Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {booking.gymName || 'Unknown Gym'}
                </h3>

                {/* ✅ Date */}
                <p className="text-gray-600">
                  📅 Date:{' '}
                  {booking.date
                    ? new Date(booking.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>

                {/* ✅ Time */}
                <p className="text-gray-600">🕒 Time: {booking.timeSlot || 'N/A'}</p>

                {/* ✅ Trainer */}
                <p className="text-gray-600">
                  🏃‍♂️ Trainer: {booking.trainerName || 'No Trainer'}
                </p>

                {/* ✅ Payment Status */}
                <p
                  className={`mt-2 font-medium ${
                    booking.paymentStatus === 'confirmed'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  ✅ Status: {booking.paymentStatus}
                </p>

                {/* ✅ Payment Amount */}
                <p className="text-gray-600">
                  💸 Payment: ₹{totalAmount.toFixed(2)}
                </p>

                {/* ✅ Expand/Collapse Button */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="mt-3 text-blue-500 hover:underline"
                >
                  {expandedIndex === index ? 'Hide Details' : 'Show Details'}
                </button>

                {/* ✅ Collapsible Payment Slip */}
                {expandedIndex === index && (
                  <div className="mt-4 bg-gray-100 p-3 rounded-md">
                    <h4 className="font-bold text-gray-700 mb-2">Payment Summary:</h4>
                    <p className="text-gray-600">Gym Fees: ₹{gymFees}</p>
                    <p className="text-gray-600">
                      Trainer Fees: ₹{trainerFees || 0}
                    </p>
                    <p className="text-gray-600">
                      GST (18% on Gym Fees): ₹{gstAmount.toFixed(2)}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      Total Amount: ₹{totalAmount.toFixed(2)}
                    </p>
                  </div>
                )}

                {/* ✅ Booking Created Date */}
                <p className="text-right text-xs text-gray-400 mt-4">
                  Booked on:{' '}
                  {new Date(booking.$createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ View More Button */}
      {bookings.length > 5 && (
        <div className="text-center mt-6">
          <button className="text-blue-500 hover:underline">
            View More Bookings
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
