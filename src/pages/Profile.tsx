import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { databases } from "../appwrite/appwrite";
import { Query } from "appwrite";

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user) {
          const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID,
            [Query.equal("userId", user.$id)]
          );
          setBookings(response.documents.reverse());
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    const fetchGyms = async () => {
      try {
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_GYM_COLLECTION_ID
        );
        setGyms(response.documents);
      } catch (error) {
        console.error("Failed to fetch gyms:", error);
      }
    };

    fetchBookings();
    fetchGyms();
  }, [user]);

  if (bookings.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10 text-lg">
        No bookings available.
      </div>
    );
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Your Bookings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.slice(0, 5).map((booking, index) => {
          const gym = gyms.find((g) => g.gymName === booking.gymName);
          const gymFees = Number(gym?.basePrice) || 0;
          const trainer = gym?.trainers
            ? JSON.parse(gym.trainers).find((t: any) => t.name === booking.trainerName)
            : null;
          const trainerFees = Number(trainer?.price) || 0;
          const gstAmount = gymFees * 0.18;
          const totalAmount = gymFees + trainerFees + gstAmount;

          return (
            <motion.div
              key={booking.$id}
              className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform transform"
              // whileHover={{ scale: 1.03 }}
            >
              <img
                src={booking.gymImage || "/default-gym.jpg"}
                alt={booking.gymName || "Gym"}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {booking.gymName || "Unknown Gym"}
                </h3>
                <p className="text-gray-600">📅 {new Date(booking.date).toLocaleDateString()}</p>
                <p className="text-gray-600">🕒 {booking.timeSlot}</p>
                <p className="text-gray-600">🏃‍♂️ {booking.trainerName || "No Trainer"}</p>
                <p className={`mt-2 font-medium ${booking.paymentStatus === "confirmed" ? "text-green-500" : "text-red-500"}`}>
                  ✅ Status: {booking.paymentStatus}
                </p>
                <p className="text-gray-800 font-semibold">💸 ₹{totalAmount.toFixed(2)}</p>

                <motion.button
                  onClick={() => toggleExpand(index)}
                  className="mt-4 px-4 py-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all"
                  whileHover={{ scale: 1.002 }}
                >
                  {expandedIndex === index ? "Hide Details" : "Show Details"}
                </motion.button>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      className="mt-4 bg-gray-100 p-3 rounded-md"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                     <h4 className="font-bold text-gray-700 mb-2">Payment Summary:</h4>
<div className="overflow-x-auto">
  <table className="w-full border-collapse border border-gray-300 rounded-lg">
    <tbody>
      <tr className="border-b border-gray-300">
        <td className="p-2 text-gray-600 font-medium">Gym Fees</td>
        <td className="p-2 text-gray-800 font-semibold">₹{gymFees}</td>
      </tr>
      <tr className="border-b border-gray-300">
        <td className="p-2 text-gray-600 font-medium">Trainer Fees</td>
        <td className="p-2 text-gray-800 font-semibold">₹{trainerFees || 0}</td>
      </tr>
      <tr className="border-b border-gray-300">
        <td className="p-2 text-gray-600 font-medium">GST (18% on Gym Fees)</td>
        <td className="p-2 text-gray-800 font-semibold">₹{gstAmount.toFixed(2)}</td>
      </tr>
      <tr className="bg-gray-100 font-semibold">
        <td className="p-2 text-gray-700">Total</td>
        <td className="p-2 text-gray-900">₹{totalAmount.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
</div>

                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-right text-xs text-gray-400 mt-4">
                  Booked on: {new Date(booking.$createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {bookings.length > 5 && (
        <div className="text-center mt-6">
          <motion.button
            className="text-blue-500 hover:underline text-lg"
            whileHover={{ scale: 1.1 }}
          >
            View More Bookings
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Profile;