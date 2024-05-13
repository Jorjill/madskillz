import "./BoxGrid.less";
import image1 from "../../assets/1.png";
import image2 from "../../assets/2.png";
import image3 from "../../assets/3.png";
import image4 from "../../assets/4.png";
import image5 from "../../assets/5.png";
import image6 from "../../assets/6.png";
import image7 from "../../assets/7.png";
import image8 from "../../assets/8.png";
import image9 from "../../assets/9.png";
import image10 from "../../assets/10.png";
import { selectSkill, skill, skillsThunks } from "../../slices/skillsSlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const imageArray = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
];

interface BoxGridProps {
  itemList: skill[];
}

export const BoxGrid: React.FC<BoxGridProps> = ({ itemList }) => {
  const dispatch = useDispatch();
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
}, []);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setNewSkillImage(data.imageUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleAddSkill = () => {
    dispatch<any>(
      skillsThunks.addSkill({ title: newSkillName, imageurl: "asdasd" })
    );
    setNewSkillName("");
    setNewSkillImage("");
    setAddSkillModal(false);
  };

  return (
    <div className="box-grid">
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
              style={{ animationDelay: `${0.04 * index}s` }} // Increment delay for each box
              onClick={() => dispatch(selectSkill(item))}
            >
              <div className="box-image">
                <img src={imageArray[index + 1]} alt={`Image ${index + 1}`} />
              </div>
              <div className="box-text">
                <p>{item.title}</p>
              </div>
            </div>
          </Link>
        ))}
        <div
          className="box"
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
  );
};
