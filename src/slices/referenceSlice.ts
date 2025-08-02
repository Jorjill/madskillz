import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

interface RootState {
  reference: ReferenceState;
}

interface Topic {
  id?: string;
  title: string;
  content: string;
  datetime: string;
}

interface Reference {
  id?: string;
  skill: string;
  topics?: Topic[];
}

interface ReferenceState {
  addReferenceMode: boolean;
  editReferenceMode: boolean;
  references: Reference[];
}

const initialState: ReferenceState = {
  addReferenceMode: false,
  editReferenceMode: false,
  references: [],
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
    setEditReferenceMode: (state) => {
      state.editReferenceMode = true;
    },
    unsetEditReferenceMode: (state) => {
      state.editReferenceMode = false;
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
  setEditReferenceMode,
  unsetEditReferenceMode,
} = referenceSlice.actions;

// Removed getAuthHeaders - now handled by apiClient automatically

export const referenceThunks = {
  fetchReferences: () => async (dispatch: any) => {
    try {
      const response = await apiClient.get('/references');
      dispatch(addReferences(response.data));
    } catch (error) {
      console.error("Failed to fetch references:", error);
    }
  },
  addTopic: (skill: string, topic: Topic) => async (dispatch: any) => {
    console.log("Adding topic:", topic);

    try {
      await apiClient.post('/topics', {
        title: topic.title,
        content: topic.content,
        skill: skill,
        datetime: topic.datetime,
      });
      dispatch(referenceThunks.fetchReferences());
    } catch (error) {
      console.error("Failed to add topic:", error);
    }
  },
  addReference: (reference: Reference) => async (dispatch: any) => {
    try {
      await apiClient.post('/references', {
        skill: reference.skill,
      });
      dispatch(referenceThunks.fetchReferences());
    } catch (error) {
      console.error("Failed to add reference:", error);
    }
  },
  deleteTopic: (id: number) => async (dispatch: any) => {
    try {
      await apiClient.delete(`/topics/${id}`);
      dispatch(referenceThunks.fetchReferences());
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
  },
  updateTopic:
    (id: number, title: string, content: string, skill: string, datetime: string) =>
    async (dispatch: any) => {
      try {
        await apiClient.put(`/topics/${id}`, {
          title: title,
          content: content,
          skill: skill,
          datetime: datetime,
        });
        dispatch(referenceThunks.fetchReferences());
      } catch (error) {
        console.error("Failed to update topic:", error);
      }
    },
};

export default referenceSlice.reducer;
