import { Card } from "../card/card";
import "./card-list.css";

const SkillsGrid = () => {
  //   const allSkills = useSelector((state) => state.employees.allEmployees);\

  const allSkills: any[] = [
    { id: 1, name: "Language" },
    { id: 2, name: "Backend" },
    { id: 3, name: "Frontend" },
    { id: 4, name: "Cloud" },
    { id: 5, name: "Devops" },
    { id: 6, name: "Algorithms" },
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
