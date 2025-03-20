import { createContext, useContext, useEffect, useState } from 'react';

interface GymOwnerAuthContextType {
  gymOwnerId: string | null;
  gymOwnerEmail: string | null;
  login: (gymOwnerId: string, gymOwnerEmail: string) => void;
  register: (id: string, email: string) => void;
  logout: () => void;
}

const GymOwnerAuthContext = createContext<GymOwnerAuthContextType | undefined>(undefined);

export const GymOwnerAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [gymOwnerId, setGymOwnerId] = useState<string | null>(null);
  const [gymOwnerEmail, setGymOwnerEmail] = useState<string | null>(null);

  useEffect(() => {
    // ✅ localStorage se ownerId leke state set karo
    const storedOwnerId = localStorage.getItem('gymOwnerId');
    const storedOwnerEmail = localStorage.getItem('gymOwnerEmail');

    if (storedOwnerId && storedOwnerEmail) {
      setGymOwnerId(storedOwnerId);
      setGymOwnerEmail(storedOwnerEmail);
    }
  }, []);

  // ✅ Gym Owner Login
  const login = (id: string, email: string) => {
    setGymOwnerId(id);
    setGymOwnerEmail(email);
    localStorage.setItem('gymOwnerId', id);
    localStorage.setItem('gymOwnerEmail', email);
  };

  // ✅ Gym Owner Register => Register ke baad direct login call hoga
  const register = (id: string, email: string) => {
    login(id, email); // ✅ Register ke baad login state set karo
  };

  // ✅ Gym Owner Logout
  const logout = () => {
    setGymOwnerId(null);
    setGymOwnerEmail(null);
    localStorage.removeItem('gymOwnerId');
    localStorage.removeItem('gymOwnerEmail');
  };

  return (
    <GymOwnerAuthContext.Provider value={{ gymOwnerId, gymOwnerEmail, login, register, logout }}>
      {children}
    </GymOwnerAuthContext.Provider>
  );
};

// ✅ useGymOwnerAuth hook for easy access
export const useGymOwnerAuth = () => {
  const context = useContext(GymOwnerAuthContext);
  if (!context) {
    throw new Error('useGymOwnerAuth must be used within a GymOwnerAuthProvider');
  }
  return context;
};
