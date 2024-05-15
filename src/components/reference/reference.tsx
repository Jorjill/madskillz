/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./reference.less";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTopicByTitle,
  referenceThunks,
  selectReferenceBySkill,
  setAddReferenceMode,
  unsetAddReferenceMode,
} from "../../slices/referenceSlice";
import { AddReference } from "../add-reference/addReference";
import { DeleteModal } from "../modal/delete-modal";
import axios from "axios";

const Reference: React.FC = () => {
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const selectedReference = useSelector((state) =>
    selectReferenceBySkill(state, selectedSkill)
  );
  const [selectedTopicTitle, setSelectedTopicTitle] = useState(
    selectedReference?.topics[0]?.title
  );
  const [noteToDelete, setNoteToDelete] = useState<string>("");
  const topics = selectedReference?.topics;
  const selectedTopic: any = topics?.find(
    (topic) => topic.title === selectedTopicTitle
  );
  const dispatch = useDispatch();
  const addReferenceMode = useSelector(
    (state: any) => state.reference.addReferenceMode
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleShowDeleteConfirmation = (title: string) => {
    setShowDeleteConfirmation(true);
    setNoteToDelete(title);
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/reference/by-name/${selectedSkill}`
        );
        if (response.data.length < 1) {
          axios.post(`http://localhost:3000/reference`, {
            skill: selectedSkill,
          });
        }
        dispatch<any>(referenceThunks.fetchReferences());
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="reference-container">
      <div className="sidebar-container">
        {topics?.map((topic, index) => (
          <div
            className="topic-title"
            key={index}
            onClick={() => {
              dispatch(unsetAddReferenceMode());
              setSelectedTopicTitle(topic.title);
            }}
          >
            {topic.title}
          </div>
        ))}
        <div
          className="add-topic-button"
          onClick={() => {
            dispatch(setAddReferenceMode());
          }}
        >
          Add topic
        </div>
      </div>

      <div className="reference-container">
        {addReferenceMode ? (
          <AddReference />
        ) : (
          <div className="reference-content-container">
            <div className="reference-title-container">
              <h1>{selectedTopic?.title}</h1>
              <div
                className="delete-topic-button"
                onClick={() => {
                  handleShowDeleteConfirmation(selectedTopic.title);
                }}
              >
                Delete
              </div>
            </div>
            <div
              className="reference-content"
              dangerouslySetInnerHTML={{ __html: selectedTopic?.content || "" }}
            ></div>
          </div>
        )}
      </div>
      {showDeleteConfirmation && (
        <DeleteModal
          noteTitle={selectedTopic?.title}
          onClose={handleCloseDeleteConfirmation}
          onConfirm={() => {
            dispatch(
              deleteTopicByTitle({
                skill: selectedSkill,
                topicTitle: selectedTopic.title,
              })
            );
            handleCloseDeleteConfirmation();
          }}
        />
      )}
    </div>
  );
};

export default Reference;
