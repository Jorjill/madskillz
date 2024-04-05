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
  references: Reference[];
}

const initialState: ReferenceState = {
  references: [
    {
      skill: "REACT",
      topics: [
        { title: "Create React App with Vite", content: "Contet here..." },
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

export const { addReference } = referenceSlice.actions;
export default referenceSlice.reducer;
