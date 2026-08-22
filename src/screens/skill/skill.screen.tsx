import "./skill.screen.less";
import { useDispatch, useSelector } from "react-redux";
import {
  deselectNote,
  deselectAddNoteMode,
  deselectEditNoteMode,
  notesThunks,
} from "../../slices/notesSlice";
import { choosePage } from "../../slices/pageSlice";
import { useEffect, lazy, Suspense } from "react";
import { LoadingScreen } from "../../components/loading/loading";
import {
  unsetAddReferenceMode,
  unsetEditReferenceMode,
} from "../../slices/referenceSlice";

const Notes = lazy(() => import("../../components/notes/Notes"));
const Reference = lazy(() => import("../../components/reference/reference"));
const Quiz = lazy(() => import("../../components/quiz/quiz"));
const Summary = lazy(() => import("../../components/summary/Summary"));
const TypingPracticeWithExercises = lazy(() => import("../../components/typing-practice/TypingPracticeWithExercises"));

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
          <Suspense fallback={<LoadingScreen />}>
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
          </Suspense>
        </main>
        <div className="layout-line"></div>
      </div>
    </div>
  );
};
