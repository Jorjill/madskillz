import { useSelector } from "react-redux";
import { BoxGrid } from "../../components/box-grid/BoxGrid";
import "./home.screen.less";
import { fetchSkills, selectSkills } from "../../slices/skillsSlice";
import { useEffect } from "react";
import { deselectNote } from "../../slices/notesSlice";
import { useDispatch } from "../../hooks";

export const HomeScreen = () => {
  const itemsList = useSelector(selectSkills);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchSkills());
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
