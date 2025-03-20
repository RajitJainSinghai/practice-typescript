import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Navbar from './components/Navbar';
import GymOwnerNavbar from './components/GymOwnerNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GymList from './pages/GymList';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import GymOwnerDashboard from './pages/GymOwnerDashboard';
import ThankyouPage from './pages/ThankYouPage';
import GymOwnerRegister from './pages/GymOwnerRegister';
import GymRegister from './pages/GymRegister';
import GymOwnerLogin from './pages/GymOwnerLogin';

const App = () => {
  const [user, setUser] = useState<string>(localStorage.getItem('userEmail') || '');
  const [isGymOwnerLoggedIn, setIsGymOwnerLoggedIn] = useState<boolean>(!!localStorage.getItem('gymOwnerId'));

  return (
    <Router>
      {/* ✅ Show GymOwnerNavbar if logged in, otherwise show normal Navbar */}
      {isGymOwnerLoggedIn ? (
        <GymOwnerNavbar setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn} />
      ) : (
        <Navbar user={user} setUser={setUser} />
      )}

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
            <Route path="/gym-owner-register" element={<GymOwnerRegister setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn} />} />
            <Route path="/register-gym" element={<GymRegister userId={localStorage.getItem('gymOwnerId') || ''} />} />
            <Route path="/gym-owner-dashboard" element={<GymOwnerDashboard />} />
            <Route path="/gym-owner-login" element={<GymOwnerLogin setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
};

export default App;
