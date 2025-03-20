import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, ID } from '../appwrite/appwrite';

type User = {
  email: string;
  name?: string;
  token?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage when the app loads
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await account.get(); // ✅ Get logged-in user
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // ✅ Login function
  const login = async (email: string, password: string) => {
    try {
      await account.createEmailSession(email, password); // ✅ Appwrite login
      const currentUser = await account.get(); // ✅ Get user details after login
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  // ✅ Register function with conflict handling
  const register = async (email: string, password: string, name: string) => {
    try {
      // ✅ Try to create the account
      await account.create(ID.unique(), email, password, name);
      await login(email, password); // ✅ Automatically login after registration
    } catch (error: any) {
      console.error('Registration failed:', error);

      // ✅ Handle Conflict Error (User already exists)
      if (error.code === 409) {
        throw new Error('Email already exists. Please try logging in.');
      }

      throw new Error('Failed to register. Please try again.');
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await account.deleteSession('current'); // ✅ Appwrite logout
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Failed to logout.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
