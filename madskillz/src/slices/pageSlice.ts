import { createSlice } from "@reduxjs/toolkit";

interface pageState {
  currentComponent: String;
}

const initialState: pageState = {
  currentComponent: "",
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    choosePage: (state, actions) => {
      state.currentComponent = actions.payload;
    },
  },
});

export const selectCurrentComponent = (state: any) =>
  state.page.currentComponent;
export const { choosePage } = pageSlice.actions;
export default pageSlice.reducer;
