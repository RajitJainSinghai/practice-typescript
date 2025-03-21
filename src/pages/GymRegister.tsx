import React, { useState } from 'react';
import { ID, databases, storage } from '../appwrite/appwrite';
import { useNavigate } from 'react-router-dom';
import { useGymOwnerAuth } from '../contexts/GymOwnerAuthContext';

const GymRegister = () => {
  const navigate = useNavigate();
  const { gymOwnerId } = useGymOwnerAuth();

  const [gymName, setGymName] = useState('');
  const [location, setLocation] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [description, setDescription] = useState('');
  const [gymImage, setGymImage] = useState<File | null>(null);
  const [trainers, setTrainers] = useState<{ name: string; price: string }[]>([{ name: '', price: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTrainer = () => {
    setTrainers([...trainers, { name: '', price: '' }]);
  };

  const removeTrainer = (index: number) => {
    if (trainers.length > 1) {
      const updatedTrainers = trainers.filter((_, i) => i !== index);
      setTrainers(updatedTrainers);
    }
  };

  const handleTrainerChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedTrainers = [...trainers];
    updatedTrainers[index][field] = value;
    setTrainers(updatedTrainers);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!gymOwnerId) {
      setError('Gym owner not logged in');
      return;
    }
    if (!gymImage) {
      setError('Please upload a gym image');
      return;
    }
    if (trainers.some(trainer => !trainer.name || !trainer.price)) {
      setError('Each trainer must have a name and a price');
      return;
    }

    setLoading(true);
    try {
      const file = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        gymImage
      );

      const imageUrl = storage.getFilePreview(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        file.$id
      );

      const response = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_GYM_COLLECTION_ID,
        ID.unique(),
        {
          gymName,
          location,
          basePrice: parseInt(basePrice),
          description,
          userId: gymOwnerId,
          image: imageUrl,
          trainers: JSON.stringify(trainers),
        }
      );

      console.log('Gym registered:', response);
      alert('Gym registered successfully!');
      navigate('/gym-owner-dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Failed to register gym');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register Gym</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Gym Name" value={gymName} onChange={(e) => setGymName(e.target.value)} className="border w-full p-2 rounded focus:outline-none focus:border-blue-500" required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border w-full p-2 rounded focus:outline-none focus:border-blue-500" required />
        <input type="number" placeholder="Base Price" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="border w-full p-2 rounded focus:outline-none focus:border-blue-500" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border w-full p-2 rounded focus:outline-none focus:border-blue-500" required />
        <input type="file" accept="image/*" onChange={(e) => setGymImage(e.target.files?.[0] || null)} className="border w-full p-2 rounded focus:outline-none focus:border-blue-500" required />
        {trainers.map((trainer, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <input type="text" placeholder="Trainer Name" value={trainer.name} onChange={(e) => handleTrainerChange(index, 'name', e.target.value)} className="border w-full p-2 rounded focus:outline-none focus:border-blue-500" required />
            <input type="number" placeholder="Trainer Price" value={trainer.price} onChange={(e) => handleTrainerChange(index, 'price', e.target.value)} className="border w-full p-2 rounded focus:outline-none focus:border-blue-500" required />
            {trainers.length > 1 && (
              <button type="button" onClick={() => removeTrainer(index)} className="text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition">Remove</button>
            )}
          </div>
        ))}
        <button 
        type="button" onClick={addTrainer} 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition">Add Trainer</button>

        <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 rounded-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition" disabled={loading}>{loading ? 'Registering...' : 'Register Gym'}</button>
      </form>
    </div>
  );
};

export default GymRegister;