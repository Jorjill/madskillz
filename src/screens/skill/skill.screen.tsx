import "./skill.screen.less";
import { useDispatch, useSelector } from "react-redux";
import {
  deselectNote,
  deselectAddNoteMode,
  deselectEditNoteMode,
} from "../../slices/notesSlice";
import { choosePage } from "../../slices/pageSlice";
import Notes from "../../components/notes/Notes";

export const SkillScreen = () => {

  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const currentComponent = useSelector(
    (state: any) => state.page.currentComponent
  )

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
                  onClick={() => {
                    dispatch(choosePage("notes"))
                    dispatch(deselectNote());
                    dispatch(deselectAddNoteMode());
                    dispatch(deselectEditNoteMode());
                  }}
                >
                  Notes
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <main id="content">
          {currentComponent=="notes"?<Notes/>:<Notes/>}
        </main>
        <div className="layout-line"></div>
      </div>
    </div>
  );
};
