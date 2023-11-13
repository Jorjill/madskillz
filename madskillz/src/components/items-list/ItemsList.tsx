import "./ItemsList.css";

interface Item {
    title: string;
    content: string;
}

interface ItemsListProps {
    itemsList: Item[];
}

export const ItemsList: React.FC<ItemsListProps> = ({ itemsList }) => {
    return(
        <div className="items-list">
            {itemsList.map((item, index)=> (
                <div className="list-box">
                    <h2>{item.title}</h2>
                    <p>{item.content}</p>
                </div>
            ))}
        </div>
    )
}