import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "../protectedRoute";
import { LoadingScreen } from "../components/loading/loading";

// Route-based code splitting
const Landing = lazy(() => import("../screens/landing/Landing"));
const Login = lazy(() => import("../screens/login/login"));
const Dashboard = lazy(() => import("../screens/dashboard/dashboard"));
const Profile = lazy(() => import("../screens/profile/profile"));
const Settings = lazy(() => import("../screens/settings/settings"));
const Layout = lazy(() => import("../components/Layout"));
const HomeScreen = lazy(() => import("../screens/home/home.screen").then(m => ({ default: m.HomeScreen })));
const SkillScreen = lazy(() => import("../screens/skill/skill.screen").then(m => ({ default: m.SkillScreen })));
export const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}> 
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};
