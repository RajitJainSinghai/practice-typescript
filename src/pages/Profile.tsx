import React from 'react';

const Profile = () => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.map((booking: any) => (
        <div key={booking.id}>
          <h3>{booking.gymName}</h3>
          <p>Date: {booking.date}</p>
          <p>Time: {booking.time}</p>
          <p>Status: {booking.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
