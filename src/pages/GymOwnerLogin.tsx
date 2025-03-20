import React, { useState } from 'react';
import { databases } from '../appwrite/appwrite';
import { useNavigate, Link } from 'react-router-dom';
import { useGymOwnerAuth } from '../contexts/GymOwnerAuthContext';

interface Props {
  setIsGymOwnerLoggedIn: (value: boolean) => void;
}

const GymOwnerLogin = ({ setIsGymOwnerLoggedIn }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useGymOwnerAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Gym Owner ko collection se fetch karo
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_GYM_OWNER_COLLECTION_ID,
        [`equal("email", "${email}")`]
      );

      if (response.documents.length === 0) {
        alert('Invalid email or password');
        return;
      }

      const gymOwner = response.documents[0];

      // ✅ Password match karo
      if (gymOwner.password !== password) {
        alert('Invalid password');
        return;
      }

      // ✅ Login ke time pe state + localStorage update karo
      login(gymOwner.$id, gymOwner.email);
      setIsGymOwnerLoggedIn(true); // ✅ State update karo taaki navbar dikh sake

      alert('Login successful');
      navigate('/register-gym'); // ✅ Gym Registration page pe redirect karo
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Gym Owner Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/gym-owner-register"
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
      </form>
    </div>
  );
};

export default GymOwnerLogin;
