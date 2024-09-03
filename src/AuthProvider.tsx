import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onIdTokenChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

interface AuthContextProps {
  user: User | null;
  idToken: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  const storeToken = async (user: User | null) => {
    if (user) {
      const idToken = await user.getIdToken();
      setIdToken(idToken);
      localStorage.setItem("idToken", idToken);
    } else {
      console.log("no user");
      setIdToken(null);
      localStorage.removeItem("idToken");
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      console.log("onIdTokenChanged triggered", user);
      setUser(user);
      await storeToken(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, idToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
