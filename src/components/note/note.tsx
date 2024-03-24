import { useSelector } from "react-redux";
import "./note.less";
import { selectNoteByTitle } from "../../slices/notesSlice";

export const Note: React.FC = () => {

  const selectedNoteTitle = useSelector(
    (state: any) => state.notes.selectedNoteTitle
  );
  const selectednote = useSelector((state) =>
    selectNoteByTitle(state, selectedNoteTitle)
  );
  return (
    <div className="note-component">
        <h1>{selectednote?.notes_title}</h1>
        <div className="note-content" dangerouslySetInnerHTML={{ __html: selectednote?.content || "" }}></div>
    </div>
  );
};
