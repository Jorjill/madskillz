import "./skill.screen.less";
import { useDispatch, useSelector } from "react-redux";
import {
  deselectNote,
  deselectAddNoteMode,
  deselectEditNoteMode,
} from "../../slices/notesSlice";
import { choosePage } from "../../slices/pageSlice";
import Notes from "../../components/notes/Notes";
import { useNavigate } from "react-router-dom";
import Reference from "../../components/reference/reference";
import { Practice } from "../../components/practice/practice";
import { useEffect, useState } from "react";
import { PracticeDropdown } from "../../components/practice-dropdown/practice-dropdown";
import { LoadingScreen } from "../../components/loading/loading";
import { Test } from "../../components/test/test";

export const SkillScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const currentComponent = useSelector(
    (state: any) => state.page.currentComponent
  );
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const practiceMode = useSelector((state: any) => state.practice.practiceMode);

  return (
    <div className="homebox">
      <div className="top-nav">
        <i
          className="ri-home-line ri-2x"
          onClick={() => {
            dispatch(choosePage("notes"));
            navigate("/");
          }}
        ></i>
      </div>
      <div className="layout-container">
        <div className="skill-title">{selectedSkill}</div>
        <header className="navbar">
          <nav className="nav-bar">
            <ul className="nav-list">
              <li>
                <button
                  className="nav-button"
                  onClick={() => {
                    dispatch(choosePage("notes"));
                    dispatch(deselectNote());
                    dispatch(deselectAddNoteMode());
                    dispatch(deselectEditNoteMode());
                  }}
                >
                  Notes
                </button>
              </li>
              <li>
                <button
                  className="nav-button"
                  onClick={() => {
                    dispatch(choosePage("reference"));
                    dispatch(deselectNote());
                    dispatch(deselectAddNoteMode());
                    dispatch(deselectEditNoteMode());
                  }}
                >
                  Reference
                </button>
              </li>
              <li
                onMouseEnter={() => setIsPracticeDropdownOpen(true)}
                onMouseLeave={() => setIsPracticeDropdownOpen(false)}
              >
                <button
                  className="nav-button"
                  onClick={() => {
                    dispatch(deselectNote());
                    dispatch(deselectAddNoteMode());
                    dispatch(deselectEditNoteMode());
                  }}
                >
                  Practice
                </button>
                {isPracticeDropdownOpen && <PracticeDropdown />}
              </li>
            </ul>
          </nav>
        </header>
        <main id="content">
          {currentComponent === "notes" ? (
            <Notes />
          ) : currentComponent === "reference" ? (
            <Reference />
          ) : currentComponent === "practice" ? (
            practiceMode === "test" ? (
              <Test />
            ) : (
              <Practice />
            )
          ) : currentComponent === "loading" ? (
            <LoadingScreen />
          ) : null}
        </main>
        <div className="layout-line"></div>
      </div>
    </div>
  );
};
