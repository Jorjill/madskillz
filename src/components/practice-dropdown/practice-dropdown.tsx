import { useDispatch } from "react-redux";
import "./practice-dropdown.less";
import { choosePage } from "../../slices/pageSlice";
import { chooseMode } from "../../slices/practiceSlice";

export const PracticeDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const practiceItems = [
    {
      id: 1,
      name: "General Basic",
      action: () => {
        dispatch(choosePage("practice"));
        dispatch(chooseMode("general"));
      },
    },
    {
      id: 2,
      name: "Specific Basic",
      action: () => {
        dispatch(choosePage("practice"));
        dispatch(chooseMode("specific"));
      }
    },
    {
      id: 3,
      name: "Past Experience",
      action: () => {
        dispatch(choosePage("practice"));
        dispatch(chooseMode("past"));
      },
    },
    {
      id: 4,
      name: "Test",
      action: () => {
        dispatch(choosePage("practice"));
        dispatch(chooseMode("test"));
      },
    },
  ];

  return (
    <ul className="practice-dropdown">
      {practiceItems.map((item) => (
        <li key={item.id} onClick={item.action} className="dropdown-item">
          {item.name}
        </li>
      ))}
    </ul>
  );
};
