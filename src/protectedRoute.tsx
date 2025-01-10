import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';
import { isOfflineMode } from './utils/offlineMode';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const offlineMode = isOfflineMode();

  if (loading && !offlineMode) {
    return <div>Loading...</div>;
  }

  if (offlineMode || user) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
