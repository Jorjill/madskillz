import { Skill } from "../Components/Skill";

export const SkillGrid: React.FC<{ skills: any }> = ({ skills }) => {
  return (
    <div className="skill-grid">
      {skills.map((skill: any) => (
        <Skill key={skill.id} skill={skill} />
      ))}
    </div>
  );
};
