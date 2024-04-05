/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

import "./reference.less";
import { useSelector } from "react-redux";
import { selectReferenceBySkill } from "../../slices/referenceSlice";

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
      <div className="reference-content-container">
        <h1>{selectedTopic.title}</h1>
        <p>{selectedTopic.content}</p>
      </div>
    </div>
  );
};

export default Reference;
