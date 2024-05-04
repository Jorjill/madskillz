/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import "./reference.less";
import { useSelector } from "react-redux";
import { selectReferenceBySkill } from "../../slices/referenceSlice";
import { AddReference } from "../add-reference/addReference";

const Reference: React.FC = () => {
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );

  const selectedReference = useSelector((state) =>
    selectReferenceBySkill(state, selectedSkill)
  );
  const [selectedTopicTitle, setSelectedTopicTitle] = useState(
    selectedReference?.topics[0].title
  );
  const topics = selectedReference?.topics;
  const selectedTopic: any = topics?.find(
    (topic) => topic.title === selectedTopicTitle
  );

  return (
    <div className="reference-container">
      <div className="sidebar-container">
        {topics?.map((topic, index) => (
          <div
            className="topic-title"
            key={index}
            onClick={() => {
              setSelectedTopicTitle(topic.title);
            }}
          >
            {topic.title}
          </div>
        ))}
      </div>

      <div className="reference-container">
        {selectedTopic?.title === "Add Topic" ? (
          <AddReference />
        ) : (
          <div className="reference-content-container">
            <div className="reference-title-container">
              <h1>{selectedTopic?.title}</h1>
            </div>
            <div
              className="reference-content"
              dangerouslySetInnerHTML={{ __html: selectedTopic?.content || "" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reference;
