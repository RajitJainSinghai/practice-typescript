import React from 'react';
import { BarChart, Users, Calendar, DollarSign } from 'lucide-react';

const SAMPLE_STATS = {
  totalBookings: 156,
  activeMembers: 89,
  monthlyRevenue: 4250,
  upcomingBookings: 12,
};

const SAMPLE_RECENT_BOOKINGS = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    date: '2024-03-15',
    time: '10:00 AM',
    service: 'General Workout',
    status: 'confirmed',
  },
  {
    id: '2',
    customerName: 'Bob Smith',
    date: '2024-03-15',
    time: '2:00 PM',
    service: 'Personal Training',
    status: 'pending',
  },
];

const GymOwnerDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Gym Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Bookings</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{SAMPLE_STATS.totalBookings}</span>
            <span className="ml-2 text-sm text-green-600">+12%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Active Members</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{SAMPLE_STATS.activeMembers}</span>
            <span className="ml-2 text-sm text-green-600">+5%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Monthly Revenue</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">${SAMPLE_STATS.monthlyRevenue}</span>
            <span className="ml-2 text-sm text-green-600">+8%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <BarChart className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Upcoming Bookings</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{SAMPLE_STATS.upcomingBookings}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {SAMPLE_RECENT_BOOKINGS.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GymOwnerDashboard;