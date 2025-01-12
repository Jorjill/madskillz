import "./skill.screen.less";
import { useDispatch, useSelector } from "react-redux";
import {
  deselectNote,
  deselectAddNoteMode,
  deselectEditNoteMode,
  notesThunks,
} from "../../slices/notesSlice";
import { choosePage } from "../../slices/pageSlice";
import Notes from "../../components/notes/Notes";
import { useNavigate } from "react-router-dom";
import Reference from "../../components/reference/reference";
import Quiz from "../../components/quiz/quiz";
import { useEffect } from "react";
import { LoadingScreen } from "../../components/loading/loading";
import { skillsThunks } from "../../slices/skillsSlice";
import {
  unsetAddReferenceMode,
  unsetEditReferenceMode,
} from "../../slices/referenceSlice";

export const SkillScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedSkill = useSelector((state: any) => state.skills.selectedSkill);
  const currentComponent = useSelector(
    (state: any) => state.page.currentComponent
  );

  useEffect(() => {
    dispatch<any>(notesThunks.fetchNotes());
  }, []);

  return (
    <div className="homebox">
      <div className="top-nav">
      </div>
      <div className="layout-container">
        <div className="skill-title-and-delete">
          <div className="skill-title">{selectedSkill.title}</div>
          <i
            className="ri-delete-bin-7-line"
            onClick={(e) => {
              e.stopPropagation();
              dispatch<any>(skillsThunks.deleteSkill(selectedSkill.id));
              navigate("/");
            }}
          ></i>
        </div>

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
                    dispatch(deselectNote());
                    dispatch(unsetAddReferenceMode());
                    dispatch(unsetEditReferenceMode());
                  }}
                >
                  Notez
                </button>
              </li>
              {selectedSkill.title != "ALL" ? (
                <li>
                  <button
                    className="nav-button"
                    onClick={() => {
                      dispatch(choosePage("reference"));
                      dispatch(deselectNote());
                      dispatch(deselectAddNoteMode());
                      dispatch(deselectEditNoteMode());
                      dispatch(unsetAddReferenceMode());
                      dispatch(unsetEditReferenceMode());
                    }}
                  >
                    Reference
                  </button>
                </li>
              ) : null}
              <li>
                <button
                  className="nav-button"
                  onClick={() => {
                    dispatch(choosePage("quiz"));
                    dispatch(deselectNote());
                    dispatch(deselectAddNoteMode());
                    dispatch(deselectEditNoteMode());
                    dispatch(unsetAddReferenceMode());
                    dispatch(unsetEditReferenceMode());
                  }}
                >
                  Quiz
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <main id="content">
          {currentComponent === "notes" ? (
            <Notes />
          ) : currentComponent === "reference" ? (
            <Reference />
          ) : currentComponent === "quiz" ? (
            <Quiz />
          ) : currentComponent === "loading" ? (
            <LoadingScreen />
          ) : null}
        </main>
        <div className="layout-line"></div>
      </div>
    </div>
  );
};
