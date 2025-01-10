import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import './BoxGrid.less';
import { selectSkill, skill, skillsThunks } from '../../slices/skillsSlice';
import { AppDispatch } from '../../state/store';

interface BoxGridProps {
  itemList: skill[];
}

const BoxGrid: React.FC<BoxGridProps> = ({ itemList = [] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchSkill, setSearchSkill] = useState("");
  const searchedSkills = itemList?.filter((skill) =>
    skill?.title?.toLowerCase().includes(searchSkill.toLowerCase())
  ) || [];
  const [addSkillModal, setAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillImage, setNewSkillImage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(skillsThunks.fetchSkills());
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSkillImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkillName && newSkillImage) {
      dispatch(skillsThunks.addSkill({ title: newSkillName, imageurl: newSkillImage }));
      setNewSkillName("");
      setNewSkillImage("");
      setAddSkillModal(false);
    }
  };

  const defaultImage = "src/assets/1.png"; // Add a default image path

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
        <div className="input-box-container">
          <input
            className="input-box"
            placeholder="Search..."
            onChange={(t) => {
              setSearchSkill(t.target.value);
            }}
          />
        </div>
        <div className="box-grid-container">
          <Link to="/skills" key={0}>
            <div
              className="box"
              style={{ animationDelay: `0s` }}
              onClick={() =>
                dispatch(selectSkill({ title: "ALL", imageurl: defaultImage }))
              }
            >
              <div className="box-image">
                <img 
                  src={defaultImage} 
                  alt="All Skills" 
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
          {searchedSkills.map((item, index) => (
            <Link to="/skills" key={index + 1}>
              <div
                className="box"
                style={{ animationDelay: `${0.009 * (index + 1)}s` }}
                onClick={() => dispatch(selectSkill(item))}
              >
                <div className="box-image">
                  <img 
                    src={item?.imageurl || defaultImage} 
                    alt={`Skill ${index + 1}`}
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
            style={{ animationDelay: `${0.009 * (searchedSkills.length + 1)}s` }}
            onClick={() => {
              setAddSkillModal(true);
            }}
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
                onClick={() => setAddSkillModal(false)}
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
