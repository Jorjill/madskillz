import { useDispatch } from "react-redux";
import { addNote, deselectNoteMode } from "../../slices/notesSlice";

export const AddNote = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        onClick={() => {
          dispatch(deselectNoteMode());
        }}
      >
        back
      </button>
      <input type="text" name="" id="" />
      <textarea />
      <button
        onClick={() => {
          dispatch(addNote({ title: "xxx", content: "xxx" }));
          dispatch(deselectNoteMode());
        }}
      >
        Create note
      </button>
    </div>
  );
};
