import React, { useState } from 'react';
import { ID, databases, storage } from '../appwrite/appwrite';
import { useNavigate } from 'react-router-dom';
import { useGymOwnerAuth } from '../contexts/GymOwnerAuthContext';

const GymRegister = () => {
  const navigate = useNavigate();
  const { gymOwnerId } = useGymOwnerAuth(); // ✅ Gym Owner ID context se le rahe hain

  const [gymName, setGymName] = useState('');
  const [location, setLocation] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [description, setDescription] = useState('');
  const [gymImage, setGymImage] = useState<File | null>(null);
  const [trainers, setTrainers] = useState<{ name: string; price: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Add Trainer Logic
  const addTrainer = () => {
    setTrainers([...trainers, { name: '', price: '' }]);
  };

  const removeTrainer = (index: number) => {
    const updatedTrainers = trainers.filter((_, i) => i !== index);
    setTrainers(updatedTrainers);
  };

  const handleTrainerChange = (index: number, field: 'name' | 'price', value: string) => {
    const updatedTrainers = [...trainers];
    updatedTrainers[index][field] = value;
    setTrainers(updatedTrainers);
  };

  // ✅ Handle Form Submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gymOwnerId) {
      alert('Gym owner not logged in');
      return;
    }

    if (!gymImage) {
      alert('Please upload a gym image');
      return;
    }

    setLoading(true);

    try {
      // ✅ Upload Gym Image to Storage
      const file = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        gymImage
      );

      const imageUrl = storage.getFilePreview(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        file.$id
      );

      // ✅ Save Gym Details in Database
      const response = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_GYM_COLLECTION_ID,
        ID.unique(),
        {
          gymName,
          location,
          basePrice: parseInt(basePrice),
          description,
          userId: gymOwnerId, // ✅ Gym Owner ka ID store kar rahe hain
          image: imageUrl,
          trainers: JSON.stringify(trainers), // ✅ Trainers ko JSON format me store kar rahe hain
        }
      );

      console.log('Gym registered:', response);
      alert('Gym registered successfully!');
      navigate('/gym-owner-dashboard'); // ✅ Dashboard pe redirect kar rahe hain
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register gym');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register Gym</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        {/* ✅ Gym Name */}
        <input
          type="text"
          placeholder="Gym Name"
          value={gymName}
          onChange={(e) => setGymName(e.target.value)}
          className="border w-full p-2 rounded focus:outline-none focus:border-blue-500"
          required
        />

        {/* ✅ Location */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border w-full p-2 rounded focus:outline-none focus:border-blue-500"
          required
        />

        {/* ✅ Base Price */}
        <input
          type="number"
          placeholder="Base Price"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className="border w-full p-2 rounded focus:outline-none focus:border-blue-500"
          required
        />

        {/* ✅ Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-2 rounded focus:outline-none focus:border-blue-500"
          required
        />

        {/* ✅ Gym Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGymImage(e.target.files?.[0] || null)}
          className="border w-full p-2 rounded focus:outline-none focus:border-blue-500"
          required
        />

        {/* ✅ Trainer Details */}
        {trainers.map((trainer, index) => (
          <div key={index} className="flex space-x-2 items-center">
            {/* Trainer Name */}
            <input
              type="text"
              placeholder="Trainer Name"
              value={trainer.name}
              onChange={(e) => handleTrainerChange(index, 'name', e.target.value)}
              className="border w-full p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />

            {/* Trainer Price */}
            <input
              type="number"
              placeholder="Trainer Price"
              value={trainer.price}
              onChange={(e) => handleTrainerChange(index, 'price', e.target.value)}
              className="border w-full p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />

            {/* Remove Trainer */}
            <button
              type="button"
              onClick={() => removeTrainer(index)}
              className="text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition"
            >
              Remove
            </button>
          </div>
        ))}

        {/* ✅ Add Trainer Button */}
        <button
          type="button"
          onClick={addTrainer}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Trainer
        </button>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Gym'}
        </button>
      </form>
    </div>
  );
};

export default GymRegister;
