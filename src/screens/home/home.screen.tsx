import { useSelector } from "react-redux";
import "./home.screen.less";
import { selectSkills, skillsThunks } from "../../slices/skillsSlice";
import { useEffect } from "react";
import { deselectNote } from "../../slices/notesSlice";
import { useDispatch } from "../../hooks";
import BoxGrid from "../../components/box-grid/BoxGrid";

export const HomeScreen = () => {
  const itemsList = useSelector(selectSkills);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(skillsThunks.fetchSkills());
    dispatch(deselectNote());
  }, [dispatch]);

  return (
    <div className="homescreen">
      <div className="homebox-homescreen">
        <BoxGrid itemList={itemsList} />
      </div>
    </div>
  );
};
