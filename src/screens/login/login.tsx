import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { isOfflineMode, setOfflineMode } from "../../utils/offlineMode";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.less";
import img from "../../assets/mskillz.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [offline, setOffline] = useState(isOfflineMode());
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (offline) {
      navigate("/home");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
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

  return (
    <div className="login-page">
      <div className="star-background" />
      <div className="login-container">
        <div className="login-card">
          <img src={img} alt="MadSkillz" className="logo" />
          <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p className="subtitle">
            {isSignUp
              ? "Start your skill mastery journey"
              : "Continue your learning journey"}
          </p>

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
            <div className="auth-container">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="google-button"
              >
                <FaGoogle />
                <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
              </button>

              <div className="divider">
                <span>or continue with email</span>
              </div>

              <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                <div className="input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {isSignUp && (
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={isLoading} className="submit-button">
                  {isLoading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </form>

              <div className="auth-switch">
                <p>
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
