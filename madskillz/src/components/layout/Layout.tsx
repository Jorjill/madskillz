import React, { useState, ReactElement } from "react";
import Component1 from "../component1/Component1";
import Component2 from "../component2/Component2";
import "./Layout.less";

const Layout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<ReactElement | null>(
    <Component1 />
  );

  const loadComponent = (component: ReactElement) => {
    setActiveComponent(component);
  };

  return (
    <div className="layout-container">
      <header className="navbar">
        <nav className="nav-bar">
          <ul className="nav-list">
            <li>
              <button
                className="nav-button"
                onClick={() => loadComponent(<Component1 />)}
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
      <div className="layout-line"></div> {/* Add the line element here */}
    </div>
  );
};

export default Layout;
