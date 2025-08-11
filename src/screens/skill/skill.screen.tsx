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
import Reference from "../../components/reference/reference";
import Quiz from "../../components/quiz/quiz";
import Summary from "../../components/summary/Summary";
import TypingPracticeWithExercises from "../../components/typing-practice/TypingPracticeWithExercises";
import { useEffect } from "react";
import { LoadingScreen } from "../../components/loading/loading";
import {
  unsetAddReferenceMode,
  unsetEditReferenceMode,
} from "../../slices/referenceSlice";

export const SkillScreen = () => {
  const dispatch = useDispatch();
  const selectedSkill = useSelector((state: any) => state.skills.selectedSkill);
  const currentComponent = useSelector(
    (state: any) => state.page.currentComponent
  );

  useEffect(() => {
    dispatch(notesThunks.fetchNotes() as any);
  }, [dispatch]);

  return (
    <div className="homebox">
      <div className="top-nav">
      </div>
      <div className="layout-container">

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
              {selectedSkill.title !== "ALL" ? (
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
              <li>
                <button
                  className="nav-button"
                  onClick={() => {
                    dispatch(choosePage("summary"));
                    dispatch(deselectNote());
                    dispatch(deselectAddNoteMode());
                    dispatch(deselectEditNoteMode());
                    dispatch(unsetAddReferenceMode());
                    dispatch(unsetEditReferenceMode());
                  }}
                >
                  Summary
                </button>
              </li>
              <li>
                <button
                  className="nav-button"
                  onClick={() => {
                    dispatch(choosePage("typing"));
                    dispatch(deselectNote());
                    dispatch(deselectAddNoteMode());
                    dispatch(deselectEditNoteMode());
                    dispatch(unsetAddReferenceMode());
                    dispatch(unsetEditReferenceMode());
                  }}
                >
                  Typing Practice
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
          ) : currentComponent === "summary" ? (
            <Summary />
          ) : currentComponent === "typing" ? (
            <TypingPracticeWithExercises />
          ) : currentComponent === "loading" ? (
            <LoadingScreen />
          ) : null}
        </main>
        <div className="layout-line"></div>
      </div>
    </div>
  );
};
