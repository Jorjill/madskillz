import { note } from "../../slices/notesSlice";
import "./ItemsList.css";

interface ItemsListProps {
  itemsList: note[];
}

export const ItemsList: React.FC<ItemsListProps> = ({ itemsList }) => {
  
  return (
    <div className="items-list-container">
      <div className="items-list">
        {itemsList.map((item, index) => (
          <div className="list-box" key={index} onClick={()=>{
            
          }}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
