import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomeScreen } from "../screens/home/home.screen";
import { SkillScreen } from "../screens/skill/skill.screen";
import ProtectedRoute from "../protectedRoute";
import Login from "../screens/login/login";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="skills"
          element={
            <ProtectedRoute>
              <SkillScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
