import { useSelector } from "react-redux";
import { BoxGrid } from "../../components/box-grid/BoxGrid";
import "./home.screen.less";
import { selectSkills } from "../../slices/skillsSlice";

export const HomeScreen = () => {
  const itemsList = useSelector(selectSkills);

  return (
    <div className="homescreen">
      <div className="homebox-homescreen">
        <div className="input-box-container">
          <input className="input-box" placeholder="Search..." />
        </div>
        <BoxGrid itemList={itemsList} />
      </div>
    </div>
  );
};