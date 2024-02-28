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
import { selectSkill, skill } from "../../slices/skillsSlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

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

  return (
    <div className="box-grid">
      {itemList.map((item, index) => (
        <Link to="/skills">
          {" "}
          <div
            className="box"
            key={index}
            onClick={() => {
              dispatch(selectSkill(item));
            }}
          >
            <div className="box-image">
              <img src={imageArray[index]} alt={`Image ${index}`} />
            </div>
            <div className="box-text">
              <p>{item.title}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
