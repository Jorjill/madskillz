import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  uid: string;
  metadata?: {
    creationTime?: string;
  };
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with a mock user for development
    const mockUser: User = {
      email: 'user@example.com',
      displayName: 'Demo User',
      uid: '123',
      metadata: {
        creationTime: new Date().toISOString(),
      },
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    try {
      setLoading(true);
      // Mock sign in - in a real app, this would authenticate with a backend
      const mockUser: User = {
        email,
        displayName: 'Demo User',
        uid: '123',
        metadata: {
          creationTime: new Date().toISOString(),
        },
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Mock sign out - in a real app, this would sign out from your backend
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
