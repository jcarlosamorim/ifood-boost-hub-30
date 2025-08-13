import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    email: 'consultor@ifood.com.br',
    name: 'Carlos Silva',
    role: 'consultant' as const,
  },
  {
    id: '2',
    email: 'restaurante@burguer.com.br',
    name: 'Ana Santos',
    role: 'restaurant_owner' as const,
    restaurantId: '1'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ifood_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('ifood_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ifood_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};