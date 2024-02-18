import { ReactElement, useState } from "react";
import Notes from "../../components/notes/Notes";
import "./skill.screen.less";
import { useSelector } from "react-redux";

export const SkillScreen = () => {
  const [activeComponent, setActiveComponent] = useState<ReactElement | null>(
    <Notes />
  );

  const loadComponent = (component: ReactElement) => {
    setActiveComponent(component);
  };

  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );

  return (
    <div className="homebox">
      <div className="layout-container">
        <div className="skill-title">{selectedSkill}</div>
        <header className="navbar">
          <nav className="nav-bar">
            <ul className="nav-list">
              <li>
                <button
                  className="nav-button"
                  onClick={() => loadComponent(<Notes />)}
                >
                  Notes
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <main id="content">{activeComponent}</main>
        <div className="layout-line"></div>
      </div>
    </div>
  );
};
