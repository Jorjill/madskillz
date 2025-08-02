import { useSelector, useDispatch } from "react-redux";
import "./note.less";
import { selectNoteByTitle, deselectNote } from "../../slices/notesSlice";

export const Note: React.FC = () => {
  const dispatch = useDispatch();
  const selectedNoteTitle = useSelector(
    (state: any) => state.notes.selectedNoteTitle
  );
  const selectednote = useSelector((state) =>
    selectNoteByTitle(state, selectedNoteTitle)
  );

  const handleBackToNotes = () => {
    dispatch(deselectNote());
  };

  return (
    <div className="note-component">
      <div className="note-header">
        <button className="back-button" onClick={handleBackToNotes}>
          <i className="ri-arrow-left-line"></i>
          Back to Notes
        </button>
        <h1>{selectednote?.notes_title}</h1>
      </div>
      <div
        className="note-content"
        dangerouslySetInnerHTML={{ __html: selectednote?.content || "" }}
      ></div>
    </div>
  );
};
