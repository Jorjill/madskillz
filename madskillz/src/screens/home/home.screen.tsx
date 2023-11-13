import { BoxGrid } from "../../components/box-grid/BoxGrid";
import "./home.screen.less";

export const HomeScreen = () => {
  const itemList = [
    {
      imageUrl: "url1",
      text: "AWS",
    },
    {
      imageUrl: "url2",
      text: "Javascript",
    },
    {
      imageUrl: "url2",
      text: "NX",
    },
    {
      imageUrl: "url2",
      text: "General",
    },
    {
      imageUrl: "url2",
      text: "Gitlab CI",
    },
    {
      imageUrl: "url2",
      text: "Nest",
    },
    {
      imageUrl: "url2",
      text: "Pulumi",
    },
    {
      imageUrl: "url2",
      text: "React",
    },
    {
      imageUrl: "url2",
      text: "SQL",
    },
    {
      imageUrl: "url2",
      text: "Serverless",
    },
  ];
  return (
    <div className="homescreen">
      <div className="homebox">
        <div className="input-box-container">
          <input className="input-box" placeholder="Search..."/>
        </div>
        <BoxGrid itemList={itemList} />
      </div>
    </div>
  );
};
