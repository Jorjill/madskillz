import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
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
  defaultImage: string;
}

const SortableSkillItem: React.FC<SortableSkillItemProps> = ({ item, index, onSelect, defaultImage }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id! });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
          <div className="modal">
            <div className="modal-content">
              <span
                className="close-button"
                onClick={closeModal}
              >
                &times;
              </span>
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
      </div>
    </div>
  );
};

export default BoxGrid;
