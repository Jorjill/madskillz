import { useDispatch, useSelector } from "react-redux";
import "./notes-list.less";
import {
  notesThunks,
  selectAddNoteMode,
  selectEditNoteMode,
  selectNote,
  selectNotesBySkill,
} from "../../slices/notesSlice";
import { useState, useEffect, useRef } from "react";
import { DeleteModal } from "../modal/delete-modal";
import { summaryEvents } from "../../utils/summaryEvents";

export const NotesList: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const reactNotes = useSelector((state) =>
    selectNotesBySkill(state, selectedSkill)
  );
  const isNoteSelected = useSelector(
    (state: any) => state.notes.isNoteSelected
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<string>("");
  const [deleteNoteId, setDeleteNoteId] = useState<string | undefined>("");

  // Store scroll position when a note is selected
  useEffect(() => {
    if (isNoteSelected && scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollTop;
      sessionStorage.setItem(`notesListScrollPosition_${selectedSkill}`, scrollPosition.toString());
    }
  }, [isNoteSelected, selectedSkill]);

  // Restore scroll position when returning to notes list
  useEffect(() => {
    if (!isNoteSelected && scrollContainerRef.current) {
      const savedScrollPosition = sessionStorage.getItem(`notesListScrollPosition_${selectedSkill}`);
      if (savedScrollPosition) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition);
          }
        }, 0);
      }
    }
  }, [isNoteSelected, selectedSkill]);

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleShowDeleteConfirmation = (title: string, id: string | undefined) => {
    setShowDeleteConfirmation(true);
    setNoteToDelete(title);
    setDeleteNoteId(id);
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
      item.notes_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.includes(searchTerm.toLowerCase())
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
      <div className="items-list-container" ref={scrollContainerRef}>
        <div className="items-list">
          {filteredAndSortedNotes.map((item, index) => (
            <div
              className="list-box"
              key={index}
              onClick={() => {
                // Store current scroll position before selecting note
                if (scrollContainerRef.current) {
                  const scrollPosition = scrollContainerRef.current.scrollTop;
                  sessionStorage.setItem(`notesListScrollPosition_${selectedSkill}`, scrollPosition.toString());
                }
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
                    handleShowDeleteConfirmation(item.notes_title, item.id);
                  }}
                ></i>
              </div>
              <p>{extractTextFromHTML(item.content).slice(0, 1000)}</p>
              <div className="tags">
                {item.tags?.map((tag, index) => (
                  <div key={index} className="tag">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeleteConfirmation && (
        <DeleteModal
          noteTitle={noteToDelete}
          onClose={handleCloseDeleteConfirmation}
          onConfirm={() => {
            console.log('Notes-list: Delete confirmed, dispatching deleteNote and triggering summary refresh');
            dispatch<any>(notesThunks.deleteNote(deleteNoteId));
            handleCloseDeleteConfirmation();
            // Trigger summary refresh after note deletion
            console.log('Notes-list: About to call summaryEvents.triggerRefresh()');
            summaryEvents.triggerRefresh();
            console.log('Notes-list: summaryEvents.triggerRefresh() called');
          }}
        />
      )}
    </div>
  );
};
