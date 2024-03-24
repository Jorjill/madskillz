import { useDispatch, useSelector } from "react-redux";
import "./notes-list.less";
import {
  deleteNote,
  selectAddNoteMode,
  selectEditNoteMode,
  selectNote,
  selectNotesBySkill,
} from "../../slices/notesSlice";
import { useState } from "react";
import { DeleteModal } from "../modal/delete-modal";

export const NotesList: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const reactNotes = useSelector((state) =>
    selectNotesBySkill(state, selectedSkill)
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<string>("");

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleShowDeleteConfirmation = (title: string) => {
    setShowDeleteConfirmation(true);
    setNoteToDelete(title);
  };

  const extractTextFromHTML = (htmlString: any) => {
    const tempDiv = document.createElement("div");
    const processedString = htmlString
      .replace(/<br\s*[\/]?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<\/li>/gi, " ")
      .replace(/<li>/gi, " - ");
    tempDiv.innerHTML = processedString;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const filteredNotes = reactNotes.filter(
    (item) =>
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes_title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAndSortedNotes = filteredNotes.sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  return (
    <div className="notes-component">
      <div className="input-and-button">
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-button">
          <div
            className="button"
            onClick={() => {
              dispatch(selectAddNoteMode());
            }}
          >
            Create Note
          </div>
        </div>
      </div>
      <div className="items-list-container">
        <div className="items-list">
          {filteredAndSortedNotes.map((item, index) => (
            <div
              className="list-box"
              key={index}
              onClick={() => {
                dispatch(selectNote(item.notes_title));
              }}
            >
              <div className="title-icons">
                <h3>{item.notes_title}</h3>
                <i
                  className="ri-edit-line"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(selectNote(item.notes_title));
                    dispatch(selectEditNoteMode());
                  }}
                ></i>
                <i
                  className="ri-delete-bin-7-line"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowDeleteConfirmation(item.notes_title);
                  }}
                ></i>
              </div>
              <p>{extractTextFromHTML(item.content).slice(0, 1000)}</p>
            </div>
          ))}
        </div>
      </div>
      {showDeleteConfirmation && (
        <DeleteModal
          noteTitle={noteToDelete}
          onClose={handleCloseDeleteConfirmation}
          onConfirm={() => {
            dispatch(deleteNote(noteToDelete));
            handleCloseDeleteConfirmation();
          }}
        />
      )}
    </div>
  );
};
