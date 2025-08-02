import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomeScreen } from "../screens/home/home.screen";
import { SkillScreen } from "../screens/skill/skill.screen";
import ProtectedRoute from "../protectedRoute";
import Login from "../screens/login/login";
import Dashboard from "../screens/dashboard/dashboard";
import Profile from "../screens/profile/profile";
import Settings from "../screens/settings/settings";
import Layout from "../components/Layout";
import Landing from "../screens/landing/Landing";
export const AppRouter = () => {
  return (
    <Router>
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
    </Router>
  );
};
