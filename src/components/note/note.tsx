import { note } from "../../slices/notesSlice";
import "./note.less";

interface NoteProps {
  note?: note;
}

export const Note: React.FC<NoteProps> = ({ note }) => {
  return (
    <div className="note-component">
        <h1>{note?.notes_title}</h1>
        <div className="note-content">{note?.content}</div>
    </div>
  );
};
