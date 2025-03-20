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
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">

          <Routes>
            {/* ✅ Normal User Pages */}
            <Route
              path="/"
              element={
                <>
                  <Navbar user={user} setUser={setUser} />
                  <Home />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar user={user} setUser={setUser} />
                  <Login setUser={setUser} />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar user={user} setUser={setUser} />
                  <Register />
                </>
              }
            />
            <Route
              path="/gyms"
              element={
                <>
                  <Navbar user={user} setUser={setUser} />
                  <GymList />
                </>
              }
            />
            <Route
              path="/booking/:gymId"
              element={
                <>
                  <Navbar user={user} setUser={setUser} />
                  <Booking user={user} />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Navbar user={user} setUser={setUser} />
                  <Profile />
                </>
              }
            />
            <Route
              path="/thank-you"
              element={
                <>
                  <Navbar user={user} setUser={setUser} />
                  <ThankyouPage />
                </>
              }
            />

            {/* ✅ Gym Owner Register/Login Pages */}
            <Route
              path="/gym-owner-register"
              element={
                <>
                  {/* ✅ GymOwnerNavbar hamesha dikhayenge */}
                  <GymOwnerNavbar
                    setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn}
                    isGymOwnerLoggedIn={isGymOwnerLoggedIn}
                  />
                  <GymOwnerRegister setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn} />
                </>
              }
            />
            <Route
              path="/gym-owner-login"
              element={
                <>
                  {/* ✅ GymOwnerNavbar hamesha dikhayenge */}
                  <GymOwnerNavbar
                    setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn}
                    isGymOwnerLoggedIn={isGymOwnerLoggedIn}
                  />
                  <GymOwnerLogin setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn} />
                </>
              }
            />

            {/* ✅ Gym Owner Pages (Only if logged in) */}
            {isGymOwnerLoggedIn && (
              <>
                <Route
                  path="/register-gym"
                  element={
                    <>
                      <GymOwnerNavbar
                        setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn}
                        isGymOwnerLoggedIn={isGymOwnerLoggedIn}
                      />
                      <GymRegister userId={localStorage.getItem('gymOwnerId') || ''} />
                    </>
                  }
                />
                <Route
                  path="/gym-owner-dashboard"
                  element={
                    <>
                      <GymOwnerNavbar
                        setIsGymOwnerLoggedIn={setIsGymOwnerLoggedIn}
                        isGymOwnerLoggedIn={isGymOwnerLoggedIn}
                      />
                      <GymOwnerDashboard />
                    </>
                  }
                />
              </>
            )}

            {/* ✅ Redirect Invalid Routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
};

export default App;
