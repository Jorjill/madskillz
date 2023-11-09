import "./BoxGrid.css";

interface Item {
  imageUrl: string;
  text: string;
}

interface BoxGridProps {
  itemList: Item[];
}

export const BoxGrid: React.FC<BoxGridProps> = ({ itemList }) => {
  return (
    <div className="box-grid">
      {itemList.map((item, index) => (
        <div className="box" key={index}>
          <div className="box-image">
            <img src={item.imageUrl} alt={`Image ${index}`} />
          </div>
          <div className="box-text">
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
