// import { AppRouter } from "./routers/AppRouter";

import { Navbar } from "./components/navbar/Navbar";
import { HomeScreen } from "./screens/home/home.screen";
import { SkillScreen } from "./screens/skill/skill.screen";

function App() {
  return (
    <div>
      <Navbar />
      <SkillScreen />
    </div>
  );
}

export default App;
