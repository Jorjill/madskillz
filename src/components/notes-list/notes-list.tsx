import { useDispatch, useSelector } from "react-redux";
import "./notes-list.less";
import {
  notesThunks,
  selectAddNoteMode,
  selectEditNoteMode,
  selectNote,
  selectNotesBySkill,
} from "../../slices/notesSlice";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { DeleteModal } from "../modal/delete-modal";
import { summaryEvents } from "../../utils/summaryEvents";

export const NotesList: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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

  // Debounce search input to avoid filtering on every keystroke
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 200);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

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

  const handleCloseDeleteConfirmation = useCallback(() => {
    setShowDeleteConfirmation(false);
  }, []);

  const handleShowDeleteConfirmation = useCallback((title: string, id: string | undefined) => {
    setShowDeleteConfirmation(true);
    setNoteToDelete(title);
    setDeleteNoteId(id);
  }, []);

  // Cache extracted text to avoid repeated heavy processing
  const textCache = useMemo(() => new Map<string, string>(), []);
  const extractTextFromHTML = useCallback((htmlString: string) => {
    // Return early for empty input
    if (!htmlString) return "";

    const cached = textCache.get(htmlString);
    if (cached) return cached;

    // Lightweight HTML to text conversion without creating DOM nodes
    const processedString = htmlString
      .replace(/<br\s*[\/]?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<\/li>/gi, " ")
      .replace(/<li>/gi, " - ")
      .replace(/<[^>]*>/g, " ") // strip remaining tags
      .replace(/\s+/g, " ") // collapse whitespace
      .trim();

    textCache.set(htmlString, processedString);
    return processedString;
  }, [textCache]);

  // Memoize filtering and sorting to avoid O(n log n) work every render
  const filteredAndSortedNotes = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    const filtered = reactNotes.filter((item: any) => {
      if (!term) return true;
      return (
        item.content?.toLowerCase().includes(term) ||
        item.notes_title?.toLowerCase().includes(term) ||
        (Array.isArray(item.tags) && item.tags.some((t: string) => t?.toLowerCase().includes(term)))
      );
    });

    return filtered.sort(
      (a: any, b: any) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  }, [reactNotes, debouncedSearch]);

  // Handlers
  const handleCreateNote = useCallback(() => {
    dispatch(selectAddNoteMode());
  }, [dispatch]);

  // Stable callbacks for list item interactions
  const handleSelectItem = useCallback((title: string) => {
    // Store current scroll position before selecting note
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollTop;
      sessionStorage.setItem(`notesListScrollPosition_${selectedSkill}`, scrollPosition.toString());
    }
    dispatch(selectNote(title));
  }, [dispatch, selectedSkill]);

  const handleEditItem = useCallback((title: string) => {
    dispatch(selectNote(title));
    dispatch(selectEditNoteMode());
  }, [dispatch]);

  const handleDeleteItem = useCallback((title: string, id?: string) => {
    handleShowDeleteConfirmation(title, id);
  }, [handleShowDeleteConfirmation]);

  // Memoized list item to minimize re-renders
  const NoteListItem: React.FC<{
    id?: string;
    title: string;
    content: string;
    tags?: string[];
    onSelect: (title: string) => void;
    onEdit: (title: string) => void;
    onDelete: (title: string, id?: string) => void;
  }> = React.memo(({ id, title, content, tags, onSelect, onEdit, onDelete }) => {
    const preview = useMemo(() => extractTextFromHTML(content).slice(0, 300), [content, extractTextFromHTML]);
    return (
      <div className="list-box" onClick={() => onSelect(title)}>
        <div className="title-icons">
          <h3>{title}</h3>
          <i
            className="ri-edit-line"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(title);
            }}
          ></i>
          <i
            className="ri-delete-bin-7-line"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(title, id);
            }}
          ></i>
        </div>
        <p>{preview}</p>
        <div className="tags">
          {tags?.map((tag, index) => (
            <div key={index} className="tag">
              {tag}
            </div>
          ))}
        </div>
      </div>
    );
  });

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
            onClick={handleCreateNote}
          >
            Create Note
          </div>
        </div>
      </div>
      <div className="items-list-container" ref={scrollContainerRef}>
        <div className="items-list">
          {filteredAndSortedNotes.map((item: any, index: number) => (
            <NoteListItem
              key={item.id || item.notes_title || index}
              id={item.id}
              title={item.notes_title}
              content={item.content}
              tags={item.tags}
              onSelect={handleSelectItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
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
});
