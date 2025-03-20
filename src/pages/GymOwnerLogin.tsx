import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases } from '../appwrite/appwrite';
import { useGymOwnerAuth } from '../contexts/GymOwnerAuthContext';

const GymOwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useGymOwnerAuth(); // ✅ Gym Owner AuthContext ko use karo

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
      if (gymOwner.password !== password) {
        alert('Invalid password');
        return;
      }

      // ✅ Login ke time pe state + localStorage update karo
      login(gymOwner.$id, gymOwner.email);

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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default GymOwnerLogin;
