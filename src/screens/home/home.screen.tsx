import { useDispatch, useSelector } from "react-redux";
import { BoxGrid } from "../../components/box-grid/BoxGrid";
import "./home.screen.less";
import { selectSkills } from "../../slices/skillsSlice";
import { useEffect } from "react";
import { deselectNote } from "../../slices/notesSlice";

export const HomeScreen = () => {
  const itemsList = useSelector(selectSkills);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(deselectNote());
  }, []);

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
