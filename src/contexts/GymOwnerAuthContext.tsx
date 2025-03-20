import { createContext, useContext, useState, useEffect } from 'react';

interface GymOwnerAuthContextType {
  gymOwnerId: string | null;
  email: string | null;
  login: (id: string, email: string) => void;
  logout: () => void;
}

const GymOwnerAuthContext = createContext<GymOwnerAuthContextType>({
  gymOwnerId: null,
  email: null,
  login: () => {},
  logout: () => {},
});

export const GymOwnerAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [gymOwnerId, setGymOwnerId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // ✅ State ko localStorage se load karo taaki refresh ke baad login state na ude
    const storedGymOwnerId = localStorage.getItem('gymOwnerId');
    const storedEmail = localStorage.getItem('gymOwnerEmail');
    if (storedGymOwnerId && storedEmail) {
      setGymOwnerId(storedGymOwnerId);
      setEmail(storedEmail);
    }
  }, []);

  const login = (id: string, email: string) => {
    setGymOwnerId(id);
    setEmail(email);
    localStorage.setItem('gymOwnerId', id);
    localStorage.setItem('gymOwnerEmail', email);
  };

  const logout = () => {
    setGymOwnerId(null);
    setEmail(null);
    localStorage.removeItem('gymOwnerId');
    localStorage.removeItem('gymOwnerEmail');
  };

  return (
    <GymOwnerAuthContext.Provider value={{ gymOwnerId, email, login, logout }}>
      {children}
    </GymOwnerAuthContext.Provider>
  );
};

export const useGymOwnerAuth = () => useContext(GymOwnerAuthContext);
