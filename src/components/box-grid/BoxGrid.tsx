import "./BoxGrid.less";
import image1 from "../../assets/1.png";
import { selectSkill, skill, skillsThunks } from "../../slices/skillsSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const imageArray = [image1];

interface BoxGridProps {
  itemList: skill[];
}

export const BoxGrid: React.FC<BoxGridProps> = ({ itemList }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchSkill, setSearchSkill] = useState("");
  const searchedSkills = itemList.filter((skill) =>
    skill.title.toLowerCase().includes(searchSkill.toLowerCase())
  );
  const [addSkillModal, setAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillImage, setNewSkillImage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      dispatch<any>(skillsThunks.fetchSkills());
    }, 500);
  }, [dispatch]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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
    dispatch<any>(
      skillsThunks.addSkill({ title: newSkillName, imageurl: newSkillImage })
    );
    setNewSkillName("");
    setNewSkillImage("");
    setAddSkillModal(false);
  };

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
        <button className="logout-button" onClick={handleLogout}>Logout</button>
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
              style={{ animationDelay: `0s` }} // Add animation delay for the first box
              onClick={() =>
                dispatch(selectSkill({ title: "ALL", imageurl: "" }))
              }
            >
              <div className="box-image">
                <img src={imageArray[0]} alt={`Image ${0}`} />
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
                style={{ animationDelay: `${0.009 * (index + 1)}s` }} // Increment delay for each box, starting from the second box
                onClick={() => dispatch(selectSkill(item))}
              >
                <div className="box-image">
                  <img src={item.imageurl} alt={`Image ${index + 1}`} />
                </div>
                <div className="box-text">
                  <p>{item.title}</p>
                </div>
              </div>
            </Link>
          ))}
          <div
            className="box"
            style={{ animationDelay: `${0.009 * (searchedSkills.length + 1)}s` }} // Add animation delay for the last box
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
