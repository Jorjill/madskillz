import { BoxGrid } from "../../components/box-grid/BoxGrid";
import "./home.screen.less";

export const HomeScreen = () => {
  const itemList = [
    {
      imageUrl: "url1",
      text: "Item 1",
    },
    {
      imageUrl: "url2",
      text: "Item 2",
    },
    {
      imageUrl: "url2",
      text: "Item 2",
    },
    {
      imageUrl: "url2",
      text: "Item 2",
    },
    {
      imageUrl: "url2",
      text: "Item 2",
    },
    {
      imageUrl: "url2",
      text: "Item 2",
    },
  ];
  return (
    <div className="homescreen">
      <div className="homebox">
        <BoxGrid itemList={itemList} />
      </div>
    </div>
  );
};
