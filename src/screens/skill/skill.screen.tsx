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
import TypingPractice from "../../components/typing-practice/TypingPractice";
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
            <TypingPractice 
              codeText={`// Welcome to Typing Practice!
// Practice typing code to improve your speed and accuracy

function greetUser(name) {
  console.log("Hello, " + name + "!");
  return "Welcome to MadSkillz!";
}

const user = "Developer";
const message = greetUser(user);

// Try typing this code exactly as shown
// The cursor will guide you letter by letter
for (let i = 0; i < 3; i++) {
  console.log(\`Iteration \${i + 1}: \${message}\`);
}`}
              onComplete={() => {
                console.log('Typing practice completed!');
              }}
            />
          ) : currentComponent === "loading" ? (
            <LoadingScreen />
          ) : null}
        </main>
        <div className="layout-line"></div>
      </div>
    </div>
  );
};
