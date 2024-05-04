import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

interface RootState {
  reference: ReferenceState;
}

interface Topic {
  title: string;
  content: string;
}

interface Reference {
  skill: string;
  topics: Topic[];
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
        reference.topics.push(topic);
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
      const reference = state.references.find(ref => ref.skill === skill);
      if (reference) {
        reference.topics = reference.topics.filter(topic => topic.title !== topicTitle);
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

export const { addReference, addTopicToReference, setAddReferenceMode, unsetAddReferenceMode, deleteTopicByTitle } =
  referenceSlice.actions;
export default referenceSlice.reducer;
