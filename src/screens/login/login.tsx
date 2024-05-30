import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onIdTokenChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import "./login.less";
import img from  "../../assets/mskillz.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
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
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      storeToken(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await storeToken(user);
      }
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      const user = auth.currentUser;
      if (user) {
        await storeToken(user);
      }
      navigate("/"); // Redirect to a protected route after successful login
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <img src={img} alt="logo" />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Login</button>
        </form>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    </div>
  );
};

export default Login;
