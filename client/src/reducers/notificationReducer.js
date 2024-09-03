import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notificationText",
    initialState: "",
    reducers: {
      changeMessage(state, action) {
        return action.payload;
      },
    },
});

export const { changeMessage } = notificationSlice.actions;

export const setNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(changeMessage(message));
    setTimeout(() => {
      dispatch(changeMessage(""));
    }, time * 1000);
  };
};
export default notificationSlice.reducer;