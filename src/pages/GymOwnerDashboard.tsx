import { useEffect, useState } from 'react';
import { databases, storage } from '../appwrite/appwrite';
import { useGymOwnerAuth } from '../contexts/GymOwnerAuthContext';

interface Gym {
  $id: string;
  gymName: string;
  location: string;
  basePrice: number;
  description: string;
  image: string;
}

const GymOwnerDashboard = () => {
  const { gymOwnerId } = useGymOwnerAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGyms = async () => {
      if (!gymOwnerId) return;
      setLoading(true);

      try {
        // ✅ Fetch gyms connected to the logged-in gym owner
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_GYM_COLLECTION_ID,
          [`equal("userId", "${gymOwnerId}")`]
        );

        if (response.documents.length) {
          const gymsWithImages = await Promise.all(
            response.documents.map(async (gym) => {
              let imageUrl = '';
              if (gym.image) {
                // ✅ Fetch image from storage
                imageUrl = storage.getFilePreview(
                  import.meta.env.VITE_APPWRITE_GYM_BUCKET_ID,
                  gym.image
                ).href;
              }
              return { ...gym, image: imageUrl };
            })
          );

          setGyms(gymsWithImages);
        }
      } catch (error) {
        console.error('Failed to fetch gyms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, [gymOwnerId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Gyms</h2>
      {gyms.length === 0 ? (
        <p>No gyms found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gyms.map((gym) => (
            <div key={gym.$id} className="bg-white shadow-md p-4 rounded-md">
              {gym.image ? (
                <img
                  src={gym.image}
                  alt={gym.gymName}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-bold">{gym.gymName}</h3>
              <p>{gym.location}</p>
              <p className="text-gray-600">{gym.description}</p>
              <p className="font-semibold">₹{gym.basePrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GymOwnerDashboard;
