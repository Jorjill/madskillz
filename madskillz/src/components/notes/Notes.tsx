import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNote,
  selectNoteByTitle,
  selectNotes,
} from "../../slices/notesSlice";
import "./notes.less";
import { Note } from "../note/note";

const Notes: React.FC = () => {
  const notes = useSelector(selectNotes);
  const [selectednotetitle, setSelectednotetitle] = useState("");
  const selectednote = useSelector((state) =>
    selectNoteByTitle(state, selectednotetitle)
  );
  const isNoteSelected = useSelector(
    (state: any) => state.notes.isNoteSelected
  );
  const dispatch = useDispatch();

  {
    if (isNoteSelected) {
      return <Note note={selectednote} />;
    } else {
      return (
        <div>
          <button>add note</button>
          <div className="items-list-container">
            <div className="items-list">
              {notes.map((item, index) => (
                <div
                  className="list-box"
                  key={index}
                  onClick={() => {
                    setSelectednotetitle(item.title);
                    dispatch(selectNote());
                  }}
                >
                  <h2>{item.title}</h2>
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
};

export default Notes;
