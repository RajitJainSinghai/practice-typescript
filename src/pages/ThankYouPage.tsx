import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { databases } from '../appwrite/appwrite';
import { Query } from 'appwrite';

const ThankYouPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user) {
          const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID,
            [Query.equal('userId', user.$id)]
          );
          // ✅ Show only the latest booking
          const sortedBookings = response.documents.sort(
            (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
          );
          setBookings(sortedBookings.slice(0, 1)); // Show only the most recent booking
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Loading latest booking...
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No recent booking available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
        🎉 Thank You for Your Booking! 🎉
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.$id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={booking.gymImage || '/default-gym.jpg'}
              alt={booking.gymName || 'Gym'}
              className="w-full h-48 object-cover"
              onError={(e) => (e.currentTarget.src = '/default-gym.jpg')}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {booking.gymName || 'Unknown Gym'}
              </h3>

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

              <p className="text-gray-600">🕒 Time: {booking.timeSlot || 'N/A'}</p>
              <p className="text-gray-600">🏃‍♂️ Trainer: {booking.trainerName || 'No Trainer'}</p>
              <p className={`mt-2 font-medium ${booking.paymentStatus === 'confirmed' ? 'text-green-500' : 'text-red-500'}`}>
                ✅ Status: {booking.paymentStatus}
              </p>
              <p className="text-gray-600">💸 Payment: ₹{Number(booking.paymentAmount) || 0}</p>
              <p className="text-gray-400 text-sm mt-4 text-right">
                📆 Booked on:{' '}
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
        ))}
      </div>
    </div>
  );
};

export default ThankYouPage;
