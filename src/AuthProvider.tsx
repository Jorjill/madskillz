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
  storeToken: (user: User | null) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const offlineMode = isOfflineMode();

  const storeToken = async (user: User | null) => {
    if (user) {
      try {
        console.log("Attempting to refresh token...");
        const idToken = await user.getIdToken(true); // Force token refresh
        console.log("Token refreshed successfully");
        setIdToken(idToken);
        localStorage.setItem("idToken", idToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        setIdToken(null);
        localStorage.removeItem("idToken");
      }
    } else {
      console.log("No user, clearing token");
      setIdToken(null);
      localStorage.removeItem("idToken");
    }
  };

  useEffect(() => {
    console.log("AuthProvider effect running, offlineMode:", offlineMode);
    
    if (offlineMode) {
      const mockUser = getMockUser() as any;
      setUser(mockUser);
      setIdToken('offline-token');
      localStorage.setItem("idToken", 'offline-token');
      return;
    }

    // Check and refresh token immediately if there's a current user
    const initializeToken = async () => {
      const currentUser = auth.currentUser;
      console.log("Initial auth check - currentUser:", currentUser?.email);
      if (currentUser) {
        console.log("Performing initial token refresh");
        await storeToken(currentUser);
      }
    };
    initializeToken();

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      console.log("onIdTokenChanged triggered - user:", user?.email);
      setUser(user);
      await storeToken(user);
    });

    return () => {
      console.log("Cleaning up auth listener");
      unsubscribe();
    };
  }, [offlineMode]);

  return (
    <AuthContext.Provider value={{ user, idToken, storeToken }}>
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
