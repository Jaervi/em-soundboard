import { createSlice } from "@reduxjs/toolkit";

const initialState = { notification: "", variant: "success" };

const notificationSlice = createSlice({
  name: "notificationText",
  initialState,
  reducers: {
    changeMessage(state, action) {
      console.log(action.payload);
      return action.payload;
    },
  },
});

export const { changeMessage } = notificationSlice.actions;

export const setNotification = (message, variant, time = 5) => {
  return async (dispatch) => {
    dispatch(changeMessage({ notification: message, variant }));
    setTimeout(() => {
      dispatch(changeMessage(initialState));
    }, time * 1000);
  };
};
export default notificationSlice.reducer;
