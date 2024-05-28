/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./reference.less";
import { useDispatch, useSelector } from "react-redux";
import {
  referenceThunks,
  selectReferenceBySkill,
  setAddReferenceMode,
  setEditReferenceMode,
  unsetAddReferenceMode,
  unsetEditReferenceMode,
} from "../../slices/referenceSlice";
import { AddReference } from "../add-reference/addReference";
import { DeleteModal } from "../modal/delete-modal";
import axios from "axios";
import { EditTopic } from "../edit-topic/edit-topic";

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
  const editReferenceMode = useSelector(
    (state: any) => state.reference.editReferenceMode
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

  const getAuthHeaders = () => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      throw new Error("No token found. User might not be authenticated.");
    }
    return {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/references/by-name/${selectedSkill}`,
          getAuthHeaders()
        );
        if (response.data.length < 1) {
          axios.post(`http://localhost:3000/references`, {
            skill: selectedSkill,
          }, getAuthHeaders());
        }
        dispatch<any>(referenceThunks.fetchReferences());
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };
    fetchSkills();
  }, []);

  const sortedTopics = topics?.slice().sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="reference-container">
      <div className="sidebar-container">
        {sortedTopics?.map((topic, index) => (
          <div
            className="topic-title"
            key={index}
            onClick={() => {
              dispatch(unsetAddReferenceMode());
              dispatch(unsetEditReferenceMode());
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

      <div className="reference-content-container">
        {addReferenceMode ? (
          <AddReference />
        ) : editReferenceMode ? (
          <EditTopic id={selectedTopic.id} />
        ) : (
          <div className="reference-content-container">
            <div className="reference-title-container">
              <h1>{selectedTopic?.title}</h1>
              <i
                className="ri-edit-line"
                onClick={() => {
                  dispatch(setEditReferenceMode());
                }}
              ></i>
              <i
                className="ri-delete-bin-7-line"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDeleteConfirmation(selectedTopic.title);
                }}
              ></i>
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
            dispatch<any>(referenceThunks.deleteTopic(selectedTopic?.id));
            handleCloseDeleteConfirmation();
          }}
        />
      )}
    </div>
  );
};

export default Reference;
