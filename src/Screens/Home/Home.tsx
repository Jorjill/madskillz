import SkillsGrid from "../../Components/skills/SkillsGrid";
import "./home-container.css";

export const Home = (skills: any) => {
  return (
    <div className="home-container">
      <div className="top-nav">
        <p className="skills-text">Skills</p>
      </div>
      <SkillsGrid />
    </div>
  );
};