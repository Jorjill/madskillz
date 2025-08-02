import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onIdTokenChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { isOfflineMode, getMockUser } from "./utils/offlineMode";

interface AuthContextProps {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  storeToken: (user: User | null) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const offlineMode = isOfflineMode();

  const storeToken = async (user: User | null) => {
    if (user) {
      try {
        const idToken = await user.getIdToken(true); // Force token refresh
        setIdToken(idToken);
        localStorage.setItem("idToken", idToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        setIdToken(null);
        localStorage.removeItem("idToken");
      }
    } else {
      setIdToken(null);
      localStorage.removeItem("idToken");
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    if (offlineMode) {
      return 'offline-token';
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    try {
      const newToken = await currentUser.getIdToken(true); // Force refresh
      setIdToken(newToken);
      localStorage.setItem("idToken", newToken);
      return newToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIdToken(null);
      localStorage.removeItem("idToken");
      return null;
    }
  };

  const signOut = async (): Promise<void> => {
    if (offlineMode) {
      // In offline mode, just clear local state
      setUser(null);
      setIdToken(null);
      localStorage.removeItem("idToken");
      return;
    }

    try {
      // Sign out from Firebase
      await auth.signOut();
      
      // Clear local state
      setUser(null);
      setIdToken(null);
      localStorage.removeItem("idToken");
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if Firebase signOut fails, clear local state
      setUser(null);
      setIdToken(null);
      localStorage.removeItem("idToken");
      throw error;
    }
  };

  useEffect(() => {
    if (offlineMode) {
      const mockUser = getMockUser() as any;
      setUser(mockUser);
      setIdToken('offline-token');
      localStorage.setItem("idToken", 'offline-token');
      setLoading(false);
      return;
    }

    // Check and refresh token immediately if there's a current user
    const initializeToken = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await storeToken(currentUser);
      }
      setLoading(false);
    };
    initializeToken();

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setUser(user);
      await storeToken(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [offlineMode]);

  return (
    <AuthContext.Provider value={{ user, idToken, loading, storeToken, refreshToken, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
