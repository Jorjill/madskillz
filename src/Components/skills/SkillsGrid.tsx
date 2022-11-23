import { Card } from "../card/card";
import "./card-list.css";
import { useSelector } from "react-redux";

const SkillsGrid = () => {
  //   const allSkills = useSelector((state) => state.employees.allEmployees);\

  const allSkills: any[] = [
    { id: 1, name: "language" },
    { id: 2, name: "backend" },
    { id: 3, name: "frontend" },
    { id: 4, name: "cloud" },
    { id: 5, name: "devops" },
    { id: 6, name: "algorithms" },
  ];

  return (
    <div>
      <div className="card-list">
        {allSkills.map((skill) => {
          return <Card skill={skill} key={skill.id} />;
        })}
      </div>
    </div>
  );
};

export default SkillsGrid;
