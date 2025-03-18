import React from 'react';

const ThankYouPage = () => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  console.log('Thank You Page Data:', bookings);

  if (bookings.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No bookings available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Thank You for Your Bookings!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((booking: any) => (
          <div
            key={booking.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            {/* ✅ Image Fix */}
            <img
              src={booking.gymImage || 'https://via.placeholder.com/400'}
              alt={booking.gymName || 'Gym'}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {booking.gymName || 'Unknown Gym'}
              </h3>
              <p className="text-gray-600">Date: {booking.date}</p>
              <p className="text-gray-600">Time: {booking.time}</p>
              <p className="text-gray-600">
                Trainer: {booking.trainer || 'No Trainer'}
              </p>
              <p
                className={`mt-2 font-medium ${
                  booking.status === 'confirmed'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                Status: {booking.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThankYouPage;
