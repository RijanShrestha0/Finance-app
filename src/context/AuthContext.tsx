import { createContext, useState, useEffect, type ReactNode,  } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email);
    
    if (foundUser) {
      if (foundUser.password !== password) {
        throw new Error('Incorrect password');
      }
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      throw new Error('User not found');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      email,
      password 
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Don't include password in the active session user state
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(sessionUser);
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (name: string, email: string) => {
    if (!user) {
      throw new Error('Not authenticated');
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email && u.id !== user.id);

    if (existingUser) {
      throw new Error('Email is already used by another account');
    }

    const updatedUsers = users.map((u: any) => {
      if (u.id !== user.id) {
        return u;
      }

      return {
        ...u,
        name,
        email,
      };
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const updatedSessionUser = {
      ...user,
      name,
      email,
    };
    setUser(updatedSessionUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedSessionUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
