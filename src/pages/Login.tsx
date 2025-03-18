import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before attempting login

    try {
      await login(email, password);

      // ✅ Redirect to the original path or fallback to gym booking
      const redirectTo = location.state?.from || '/gym-booking';
      navigate(redirectTo);
    } catch (error) {
      setError('Login failed! Please check your credentials and try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
      
      {error && (
        <div className="mb-4 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg outline-none transition-all duration-200"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg outline-none transition-all duration-200"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 w-full rounded-lg transition-all duration-200"
        >
          Login
        </button>
      </form>

      {/* Sign Up Option */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          to="/register"
          state={{ from: location.state?.from }} // ✅ Pass the state to register
          className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default Login;
