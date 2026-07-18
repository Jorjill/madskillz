import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './BoxGrid.less';
import {
  skillsThunks,
  selectSkill,
  skill,
} from "../../slices/skillsSlice";
import { AppDispatch } from '../../state/store';

interface SortableSkillItemProps {
  item: skill;
  index: number;
  onSelect: (skill: skill) => void;
  onEdit: (skill: skill) => void;
  onDelete: (skill: skill) => void;
  defaultImage: string;
}

const SortableSkillItem: React.FC<SortableSkillItemProps> = ({ item, index, onSelect, onEdit, onDelete, defaultImage }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id! });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-wrapper" {...attributes} {...listeners}>
      <div className="box-actions">
        <button
          className="action-btn edit-btn"
          title="Edit skill"
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); e.preventDefault(); onEdit(item); }}
        >
          <EditOutlinedIcon style={{ fontSize: 14 }} />
        </button>
        <button
          className="action-btn delete-btn"
          title="Delete skill"
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); e.preventDefault(); onDelete(item); }}
        >
          <DeleteOutlineIcon style={{ fontSize: 14 }} />
        </button>
      </div>
      <Link to="/skills" draggable={false} onClick={() => onSelect(item)}>
        <div
          className="box"
          style={{ animationDelay: `${0.009 * (index + 1)}s` }}
        >
          <div className="box-image">
            <img
              src={item?.imageurl || defaultImage}
              alt={item?.title || `Skill ${index + 1}`}
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultImage;
              }}
            />
          </div>
          <div className="box-text">
            <p>{item?.title || 'Untitled Skill'}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

interface BoxGridProps {
  itemList: skill[];
}

const BoxGrid: React.FC<BoxGridProps> = ({ itemList = [] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [items, setItems] = useState<skill[]>(itemList);
  const [addSkillModal, setAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillImage, setNewSkillImage] = useState("");
  const [editingSkill, setEditingSkill] = useState<skill | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [deletingSkill, setDeletingSkill] = useState<skill | null>(null);

  useEffect(() => {
    setItems(itemList);
  }, [itemList]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((current) => {
        const oldIndex = current.findIndex((i) => i.id === active.id);
        const newIndex = current.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(current, oldIndex, newIndex);
        dispatch(skillsThunks.reorderSkills(reordered));
        return reordered;
      });
    }
  }, [dispatch]);

  // Memoize file change handler
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSkillImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Memoize add skill handler
  const handleAddSkill = useCallback(() => {
    if (newSkillName.trim() && newSkillImage) {
      dispatch(skillsThunks.addSkill({ title: newSkillName.trim(), imageurl: newSkillImage }));
      setNewSkillName("");
      setNewSkillImage("");
      setAddSkillModal(false);
    }
  }, [dispatch, newSkillName, newSkillImage]);

  // Memoize skill selection handler
  const handleSkillSelect = useCallback((skill: skill) => {
    dispatch(selectSkill(skill));
  }, [dispatch]);

  // Memoize modal handlers
  const openModal = useCallback(() => setAddSkillModal(true), []);
  const closeModal = useCallback(() => setAddSkillModal(false), []);

  const handleEditOpen = useCallback((skill: skill) => {
    setEditingSkill(skill);
    setEditTitle(skill.title);
    setEditImage(skill.imageurl);
    setEditImagePreview("");
  }, []);

  const handleEditFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditImage(result);
        setEditImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingSkill?.id && editTitle.trim()) {
      dispatch(skillsThunks.updateSkill(editingSkill.id, {
        title: editTitle.trim(),
        imageurl: editImage,
      }));
      setEditingSkill(null);
    }
  }, [dispatch, editingSkill, editTitle, editImage]);

  const handleDeleteOpen = useCallback((skill: skill) => {
    setDeletingSkill(skill);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingSkill?.id) {
      dispatch(skillsThunks.deleteSkill(deletingSkill.id));
      setDeletingSkill(null);
    }
  }, [dispatch, deletingSkill]);

  // Memoize default image to prevent re-creation
  const defaultImage = useMemo(() => 
    "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Graduation%20cap/3D/graduation_cap_3d.png",
    []
  );

  // Memoize default skill object
  const defaultSkill = useMemo(() => ({ title: "ALL", imageurl: defaultImage }), [defaultImage]);

  const itemIds = useMemo(() => items.filter(i => i.id).map(i => i.id!), [items]);

  return (
    <div className="box-grid">
      <div className="background-effects">
        <div className="cosmic-background" />
        <div className="galaxy" />
        <div className="nebula" />
        <div className="star-field" />
        <div className="meteor-shower">
          <div className="meteor" />
          <div className="meteor" />
          <div className="meteor" />
        </div>
        <div className="aurora" />
      </div>
      <div className="content-wrapper">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemIds} strategy={rectSortingStrategy}>
            <div className="box-grid-container">
              <Link to="/skills" key={0}>
                <div
                  className="box"
                  style={{ animationDelay: `0s` }}
                  onClick={() => handleSkillSelect(defaultSkill)}
                >
                  <div className="box-image">
                    <img
                      src={defaultImage}
                      alt="All Skills"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = defaultImage;
                      }}
                    />
                  </div>
                  <div className="box-text">
                    <p>ALL</p>
                  </div>
                </div>
              </Link>
              {items.map((item, index) => (
                <SortableSkillItem
                  key={item.id}
                  item={item}
                  index={index}
                  onSelect={handleSkillSelect}
                  onEdit={handleEditOpen}
                  onDelete={handleDeleteOpen}
                  defaultImage={defaultImage}
                />
              ))}
              <div
                className="box"
                style={{ animationDelay: `${0.009 * (items.length + 1)}s` }}
                onClick={openModal}
              >
                <div className="box-text">
                  <p>+</p>
                </div>
              </div>
            </div>
          </SortableContext>
        </DndContext>
        {addSkillModal && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <span className="close-button" onClick={closeModal}>&times;</span>
              <h2>Add New Skill</h2>
              <input
                type="text"
                placeholder="Skill Name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />
              <input type="file" onChange={handleFileChange} accept="image/*" />
              <button onClick={handleAddSkill}>Add Skill</button>
            </div>
          </div>
        )}

        {editingSkill && (
          <div className="modal" onClick={() => setEditingSkill(null)}>
            <div className="modal-content modal-content--edit" onClick={e => e.stopPropagation()}>
              <span className="close-button" onClick={() => setEditingSkill(null)}>&times;</span>
              <h2>Edit Skill</h2>
              <div className="edit-image-preview">
                <img
                  src={editImagePreview || editingSkill.imageurl}
                  alt={editingSkill.title}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <input
                type="text"
                placeholder="Skill Name"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
              />
              <label className="file-label">
                <span>Change Image</span>
                <input type="file" onChange={handleEditFileChange} accept="image/*" />
              </label>
              <button onClick={handleSaveEdit} disabled={!editTitle.trim()}>Save Changes</button>
            </div>
          </div>
        )}

        {deletingSkill && (
          <div className="modal" onClick={() => setDeletingSkill(null)}>
            <div className="modal-content modal-content--delete" onClick={e => e.stopPropagation()}>
              <div className="delete-icon-circle">
                <DeleteOutlineIcon style={{ fontSize: 28 }} />
              </div>
              <h2>Delete Skill?</h2>
              <p className="delete-subtitle">
                <span>"{deletingSkill.title}"</span> will be permanently removed.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeletingSkill(null)}>Cancel</button>
                <button className="btn-delete" onClick={handleConfirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxGrid;
