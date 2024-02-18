import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomeScreen } from "../screens/home/home.screen";
import { SkillScreen } from "../screens/skill/skill.screen";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomeScreen />} />
        <Route path="/" element={<HomeScreen />}></Route>
        <Route path="skills" element={<SkillScreen />} />
      </Routes>
    </Router>
  );
};
