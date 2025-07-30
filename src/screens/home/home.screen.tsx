import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import "./home.screen.less";
import { selectSkills, skillsThunks } from "../../slices/skillsSlice";
import { deselectNote } from "../../slices/notesSlice";
import { useDispatch } from "../../hooks";
import BoxGrid from "../../components/box-grid/BoxGrid";

export const HomeScreen = React.memo(() => {
  const itemsList = useSelector(selectSkills);
  const dispatch = useDispatch();
  
  // Memoize dispatch calls
  const initializeScreen = useCallback(() => {
    dispatch(skillsThunks.fetchSkills());
    dispatch(deselectNote());
  }, [dispatch]);

  useEffect(() => {
    initializeScreen();
  }, [initializeScreen]);

  return (
    <div className="homescreen">
      <div className="homebox-homescreen">
        <BoxGrid itemList={itemsList} />
      </div>
    </div>
  );
});
