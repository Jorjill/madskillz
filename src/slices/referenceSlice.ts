import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

interface RootState {
  reference: ReferenceState;
}

interface Topic {
  id?: string;
  title: string;
  content: string;
}

interface Reference {
  id?: string;
  skill: string;
  topics?: Topic[];
}

interface ReferenceState {
  addReferenceMode: boolean;
  references: Reference[];
}

const initialState: ReferenceState = {
  addReferenceMode: false,
  references: [
    {
      skill: "REACT",
      topics: [
        {
          title: "Create React App with Vite",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum .Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        },
        { title: "Create React App with ", content: "Content hre..." },
        { title: "Create React App Vite", content: "Content ere..." },
      ],
    },
  ],
};

const referenceSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {
    addReferences: (state, action: PayloadAction<Reference[]>) => {
      state.references = action.payload;
    },
    addReference: (state, action: PayloadAction<Reference>) => {
      state.references.push(action.payload);
    },
    addTopicToReference: (
      state,
      action: PayloadAction<{ skill: string; topic: Topic }>
    ) => {
      const { skill, topic } = action.payload;
      const reference = state.references.find((ref) => ref.skill === skill);
      if (reference) {
        reference.topics?.push(topic);
      }
    },
    setAddReferenceMode: (state) => {
      state.addReferenceMode = true;
    },
    unsetAddReferenceMode: (state) => {
      state.addReferenceMode = false;
    },
    deleteTopicByTitle: (
      state,
      action: PayloadAction<{ skill: string; topicTitle: string }>
    ) => {
      const { skill, topicTitle } = action.payload;
      const reference = state.references.find((ref) => ref.skill === skill);
      if (reference) {
        reference.topics = reference.topics?.filter(
          (topic) => topic.title !== topicTitle
        );
      }
    },
  },
});

export const selectReferences = (state: RootState) =>
  state.reference.references;

export const selectReferenceBySkill = createSelector(
  [selectReferences, (_, skill: string) => skill],
  (references, skill) =>
    references.find(
      (reference) => reference.skill.toLowerCase() === skill.toLowerCase()
    )
);

export const {
  addReferences,
  addReference,
  addTopicToReference,
  setAddReferenceMode,
  unsetAddReferenceMode,
  deleteTopicByTitle,
} = referenceSlice.actions;

export const referenceThunks = {
  fetchReferences: () => async (dispatch: any) => {
    try {
      const response = await axios.get("http://localhost:3000/references");
      dispatch(addReferences(response.data));
    } catch (error) {
      console.error("Failed to fetch references:", error);
    }
  },
  addTopic: (skill: string, topic: Topic) => async (dispatch: any) => {
    try {
      console.log("adding topic ", topic);
      await axios.post(`http://localhost:3000/topics`, {
        title: topic.title,
        content: topic.content,
        skill
      });
      dispatch(referenceThunks.fetchReferences());
    } catch (error) {
      console.error("Failed to add topic:", error);
    }
  },
  addReference: (reference: Reference) => async (dispatch: any) => {
    try {
      console.log("adding reference", reference);
      
      await axios.post(`http://localhost:3000/references`, {
        skill: reference.skill,
      });
      dispatch(referenceThunks.fetchReferences());
    } catch (error) {
      console.error("Failed to add reference:", error);
    }
  },
  deleteTopic: (id:number) => async (dispatch: any) => {
    try {
      await axios.delete(`http://localhost:3000/topics/${id}`);
      dispatch(referenceThunks.fetchReferences());
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  },
};

export default referenceSlice.reducer;
