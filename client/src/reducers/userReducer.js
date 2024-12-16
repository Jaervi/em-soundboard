import { createSlice } from "@reduxjs/toolkit";
import { setNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    changeUser(state, action) {
      return action.payload;
    },
  },
});

export const { changeUser } = userSlice.actions;

//TODO: Implement when backend
/*
export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(changeUser(user));
      blogService.setToken(user.token);
    }
  };
};
*/
//TODO: Implement when backend

/*
export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(changeUser(null));
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogUser");
  };
};
*/

export const loginUser = (username, password) => {
  return async (dispatch) => {
    dispatch(setNotification(`Logged in (not quite yet) with ${username}, ${password}`, 5));
    /*try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));

      dispatch(changeUser(user));
      //blogService.setToken(user.token);
      console.log("User changed to:", user);
      dispatch(setNotification(`Logged in with ${user.username}`, 5));
    } catch (exception) {
      dispatch(setNotification("Wrong credentials", 5));
      };*/
    }
};
export default userSlice.reducer;
