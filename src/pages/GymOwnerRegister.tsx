import React, { useState } from 'react';
import { ID, databases } from '../appwrite/appwrite';
import { useNavigate, Link } from 'react-router-dom';
import { useGymOwnerAuth } from '../contexts/GymOwnerAuthContext';

interface Props {
  setIsGymOwnerLoggedIn: (value: boolean) => void;
}

const GymOwnerRegister = ({ setIsGymOwnerLoggedIn }: Props) => {
  const navigate = useNavigate();
  const { login } = useGymOwnerAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_GYM_OWNER_COLLECTION_ID,
        ID.unique(),
        {
          name,
          email,
          password,
          gymId: [],
        }
      );

      login(response.$id, email);
      setIsGymOwnerLoggedIn(true);

      alert('Registration successful! Redirecting to dashboard...');
      navigate('/register-gym');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register gym owner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Gym Owner Registration</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
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
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/gym-owner-login"
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default GymOwnerRegister;
