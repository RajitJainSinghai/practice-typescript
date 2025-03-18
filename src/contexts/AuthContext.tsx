import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  email: string;
  name?: string;
  token?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await new Promise<User>((resolve) =>
        setTimeout(() => resolve({ email, token: 'dummy-token' }), 500)
      );

      setUser(response);
      localStorage.setItem('user', JSON.stringify(response)); // ✅ Save user state
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const registerUser = async (email: string, password: string, name: string) => {
    try {
      const response = await new Promise<User>((resolve) =>
        setTimeout(() => resolve({ email, name, token: 'dummy-token' }), 500)
      );

      setUser(response);
      localStorage.setItem('user', JSON.stringify(response)); // ✅ Save user state
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Failed to register. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // ✅ Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
