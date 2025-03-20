import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Users, Calendar, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">
          Book Your Perfect Workout
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find and book the best gyms in your area. Choose your preferred time slot
          and start your fitness journey today.
        </p>
        <Link
          to="/gyms"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Find a Gym
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center space-y-3 p-6 bg-white rounded-lg shadow-md">
          <Calendar className="h-12 w-12 text-blue-600 mx-auto" />
          <h3 className="text-xl font-semibold">Flexible Booking</h3>
          <p className="text-gray-600">
            Book your sessions at your convenience with our easy-to-use platform
          </p>
        </div>
        <div className="text-center space-y-3 p-6 bg-white rounded-lg shadow-md">
          <Users className="h-12 w-12 text-blue-600 mx-auto" />
          <h3 className="text-xl font-semibold">Expert Trainers</h3>
          <p className="text-gray-600">
            Connect with certified personal trainers for guided workouts
          </p>
        </div>
        <div className="text-center space-y-3 p-6 bg-white rounded-lg shadow-md">
          <Shield className="h-12 w-12 text-blue-600 mx-auto" />
          <h3 className="text-xl font-semibold">Secure Payments</h3>
          <p className="text-gray-600">
            Safe and secure payment processing for all your bookings
          </p>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Are you a gym owner?</h2>
        <div className="text-center">
          <Link
            to="/gym-owner-register"
            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            List Your Gym
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;