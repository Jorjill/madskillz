import "./skill-container.css";
import { useParams } from "react-router-dom";
import { Card } from "../../Components/card/card";

export const NewSkill = () => {
  const { id }: any = useParams();
  const subskills: any[] = [
    { id: 1, name: "Java" },
    { id: 2, name: "Javascript" },
    { id: 3, name: "Python" },
  ];

  return (
    <div>
      <div className="top-nav"><p className="skills-text">Subskills</p></div>
    </div>
  );
};
