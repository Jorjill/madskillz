import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import './BoxGrid.less';
import {
  skillsThunks,
  selectSkill,
  skill,
} from "../../slices/skillsSlice";
import { AppDispatch } from '../../state/store';

interface BoxGridProps {
  itemList: skill[];
}

const BoxGrid: React.FC<BoxGridProps> = ({ itemList = [] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [addSkillModal, setAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillImage, setNewSkillImage] = useState("");

  // Remove redundant fetch - this should be handled by parent component
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     dispatch(skillsThunks.fetchSkills());
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [dispatch]);

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
          {itemList.map((item, index) => (
            <Link to="/skills" key={index + 1}>
              <div
                className="box"
                style={{ animationDelay: `${0.009 * (index + 1)}s` }}
                onClick={() => handleSkillSelect(item)}
              >
                <div className="box-image">
                  <img 
                    src={item?.imageurl || defaultImage} 
                    alt={item?.title || `Skill ${index + 1}`}
                    loading="lazy"
                    decoding="async"
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
          ))}
          <div
            className="box"
            style={{ animationDelay: `${0.009 * (itemList.length + 1)}s` }}
            onClick={openModal}
          >
            <div className="box-text">
              <p>+</p>
            </div>
          </div>
        </div>
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
