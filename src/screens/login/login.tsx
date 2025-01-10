import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onIdTokenChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { isOfflineMode, setOfflineMode } from "../../utils/offlineMode";
import "./login.less";
import img from "../../assets/mskillz.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [offline, setOffline] = useState(isOfflineMode());
  const navigate = useNavigate();

  const storeToken = async (user: any) => {
    if (user) {
      const idToken = await user.getIdToken();
      localStorage.setItem("idToken", idToken);
    } else {
      localStorage.removeItem("idToken");
    }
  };

  useEffect(() => {
    console.log("Offline mode:", import.meta.env.VITE_DEV);
    if (!offline) {
      const unsubscribe = onIdTokenChanged(auth, (user) => {
        storeToken(user);
      });
      return () => unsubscribe();
    }
  }, [offline]);

  const handleOfflineToggle = () => {
    const newOfflineMode = !offline;
    setOffline(newOfflineMode);
    setOfflineMode(newOfflineMode);
    if (newOfflineMode) {
      navigate("/home");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offline) {
      navigate("/home");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await storeToken(user);
      }
      navigate("/home");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (offline) {
      navigate("/home");
      return;
    }

    setError("");
    setIsLoading(true);

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src={img} alt="logo" />
      <div className="login-container">
        <h2>Welcome Back</h2>

        {(import.meta.env.VITE_DEV === "true") && (
          <div className="offline-mode-toggle">
            <button
              type="button"
              onClick={handleOfflineToggle}
              className={offline ? "active" : ""}
            >
              {offline ? "✓ Offline Mode" : "🔌 Work Offline"}
            </button>
            {offline && (
              <p className="offline-notice">
                You are working offline. No authentication required.
              </p>
            )}
          </div>
        )}

        {!offline && (
          <>
            <form onSubmit={handleLogin}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="google-button"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#ffffff"
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                />
              </svg>
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
