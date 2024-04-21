import { useDispatch, useSelector } from "react-redux";
import { addNote, deselectAddNoteMode } from "../../slices/notesSlice";
import "./addnote.less";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";

export const AddNote = () => {
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const [tags, setTags] = useState<string[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const quillRef = useRef<Quill | null>(null);
  const [tagText, setTagText] = useState("");

  useEffect(() => {
    if (quillRef.current === null) {
      // Only instantiate Quill if quillRef.current is null
      quillRef.current = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        if (quillRef.current) {
          setNoteContent(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  return (
    <div className="addnote-component">
      <div className="addnote">
        <input
          type="text"
          placeholder="Title"
          name=""
          id=""
          onChange={(t) => {
            setNoteTitle(t.target.value);
          }}
        />
        <div id="editor"></div> {/* This is where Quill will attach */}
      </div>
      <div className="button-and-tag">
        <div className="tag-input-container">
          Tags
          <input
            className="tag-input"
            type="text"
            name=""
            id=""
            value={tagText}
            onChange={(e) => {
              setTagText(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setTags([...tags, tagText]);
              setTagText("");
            }}
          >
            Add Tag
          </button>
        </div>
        <div className="tags">
          {tags.map((tag) => (
            <div
              className="tag"
              onClick={() => {
                setTags(tags.filter((t) => t !== tag));
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div
          className="create-note-button"
          onClick={() => {
            dispatch(
              addNote({
                notes_title: noteTitle,
                content: noteContent,
                noteSkill: `${selectedSkill}`,
                datetime: new Date().toISOString(),
                tags: tags
              })
            );
            dispatch(deselectAddNoteMode());
          }}
        >
          Create note
        </div>
      </div>
    </div>
  );
};
