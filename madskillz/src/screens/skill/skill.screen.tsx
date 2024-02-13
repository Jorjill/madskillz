import { ReactElement, useState } from "react";
import Notes from "../../components/notes/Notes";
import "./skill.screen.less";

export const SkillScreen = () => {
  const [activeComponent, setActiveComponent] = useState<ReactElement | null>(
    <Notes />
  );

  const loadComponent = (component: ReactElement) => {
    setActiveComponent(component);
  };

  return (
    <div className="skillscreen">
      <div className="homebox">
        <div className="layout-container">
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
                <li>
                  <button
                    className="nav-button"
                    onClick={() => loadComponent(<Component2 />)}
                  >
                    Challenge
                  </button>
                </li>
                <li>
                  <button
                    className="nav-button"
                    onClick={() => loadComponent(<Component2 />)}
                  >
                    Mock interview
                  </button>
                </li>
                <li>
                  <button
                    className="nav-button"
                    onClick={() => loadComponent(<Component2 />)}
                  >
                    Reference
                  </button>
                </li>
              </ul>
            </nav>
          </header>
          <main id="content">{activeComponent}</main>
          <div className="layout-line"></div>
        </div>
      </div>
    </div>
  );
};
