import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type User = {
  email: string;
  restaurant_name: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUserState(JSON.parse(stored));
  }, []);

  // Save user to localStorage on change
  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Optional: logout function
  const logout = () => {
    setUserState(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
