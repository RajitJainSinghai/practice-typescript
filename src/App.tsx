import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GymList from './pages/GymList';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import GymOwnerDashboard from './pages/GymOwnerDashboard';
import { AuthProvider } from './contexts/AuthContext';
import ThankyouPage from './pages/ThankYouPage';
import { useState } from 'react';

const App = () => {
  const [user, setUser] = useState<string>(localStorage.getItem('userEmail') || '');

  return (
    <AuthProvider>
      <Router>
        {/* Pass user and setUser as props to Navbar */}
        <Navbar user={user} setUser={setUser} />

        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gyms" element={<GymList />} />
              <Route path="/booking/:gymId" element={<Booking user={user} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gym-owner" element={<GymOwnerDashboard />} />
              <Route path="/thank-you" element={<ThankyouPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
