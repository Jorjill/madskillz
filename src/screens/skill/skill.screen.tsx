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
import { useEffect, useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedSkill.title);

  useEffect(() => {
    dispatch<any>(notesThunks.fetchNotes());
  }, []);

  useEffect(() => {
    setEditedTitle(selectedSkill.title);
  }, [selectedSkill.title]);

  const handleTitleEdit = () => {
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() !== selectedSkill.title) {
      dispatch<any>(skillsThunks.updateSkill(selectedSkill.id, { title: editedTitle.trim() }));
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(selectedSkill.title);
    }
  };

  return (
    <div className="homebox">
      <div className="top-nav">
      </div>
      <div className="layout-container">
        <div className="skill-title-and-delete">
          {isEditing ? (
            <input
              type="text"
              className="skill-title-input"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              autoFocus
            />
          ) : (
            <div className="skill-title" onClick={handleTitleEdit}>
              {selectedSkill.title}
            </div>
          )}
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
