import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNote,
  selectNoteByTitle,
  selectAddNoteMode,
  selectNotesBySkill,
  selectEditNoteMode,
} from "../../slices/notesSlice";
import "./notes.less";
import { Note } from "../note/note";
import { AddNote } from "../add-note/addnote";
import { EditNote } from "../edit-note/editnote";

const Notes: React.FC = () => {
  const [selectednotetitle, setSelectednotetitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const selectednote = useSelector((state) =>
    selectNoteByTitle(state, selectednotetitle)
  );
  const isEditNoteMode = useSelector(
    (state: any) => state.notes.isEditNoteMode
  );
  const isNoteSelected = useSelector(
    (state: any) => state.notes.isNoteSelected
  );
  const isAddNoteMode = useSelector((state: any) => state.notes.isAddNoteMode);
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const reactNotes = useSelector((state) =>
    selectNotesBySkill(state, selectedSkill)
  );

  const filteredNotes = reactNotes.filter((item) =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
);

  {
    if (isAddNoteMode) {
      return <AddNote />;
    } else if (isNoteSelected) {
      return <Note note={selectednote} />;
    } else if (isEditNoteMode) {
      return <EditNote />;
    } else {
      return (
        <div className="notes-component">
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
          <div className="items-list-container">
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="items-list">
              {filteredNotes.map((item, index) => (
                <div className="list-box" key={index}>
                  <div className="title-icons">
                    <h3
                      onClick={() => {
                        setSelectednotetitle(item.notes_title);
                        dispatch(selectNote());
                      }}
                    >
                      {item.notes_title}
                    </h3>
                    <i
                      className="ri-edit-line"
                      onClick={() => {
                        dispatch(selectEditNoteMode());
                      }}
                    ></i>
                    <i className="ri-delete-bin-7-line"></i>
                  </div>
                  <p
                    onClick={() => {
                      setSelectednotetitle(item.notes_title);
                      dispatch(selectNote());
                    }}
                  >
                    {item.content.slice(0, 1000)}
                  </p>
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
