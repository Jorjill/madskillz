import { useDispatch } from "react-redux";
import { deselectNote, note } from "../../slices/notesSlice";

interface NoteProps {
  note?: note;
}

export const Note: React.FC<NoteProps> = ({ note }) => {
  const dispatch = useDispatch();
  return (
    <div className="note-component">
      <button
        onClick={() => {
          dispatch(deselectNote());
        }}
      >
        back
      </button>
      <div className="note-header">
        <h1>{note?.title}</h1>
        <div>{note?.content}</div>
      </div>
    </div>
  );
};
