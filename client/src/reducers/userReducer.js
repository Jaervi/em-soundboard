import { createSlice, combineReducers } from "@reduxjs/toolkit";
import { setNotification } from "./notificationReducer";
import entryService from "../services/entries";
import loginService from "../services/login";
import userService from "../services/users";

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

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.sessionStorage.getItem("SBLoggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(changeUser(user));
      entryService.setToken(user.token);
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(changeUser(null));
    entryService.setToken(null);
    window.sessionStorage.removeItem("SBLoggedUser");
  };
};

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.sessionStorage.setItem("SBLoggedUser", JSON.stringify(user));

      dispatch(changeUser(user));
      entryService.setToken(user.token);
      //console.log("User changed to:", user);
      dispatch(setNotification(`Logged in with ${user.username}`, "success", 5));
    } catch (error) {
      if (error.response.status === 404) {
        dispatch(setNotification("Can't find login information", "danger" , 5));
      } else {
        dispatch(setNotification("Wrong credentials", "danger", 5));
      }
    }
  };
};

const userListSlice = createSlice({
  name: "allUsers",
  initialState: [],
  reducers: {
    appendUserToList(state, action) {
      state.push(action.payload);
    },
    setUserList(state, action) {
      return action.payload;
    },
    removeUserFromList(state, action) {
      return state.filter((user) => user.username != action.payload);
    },
    replaceUserInList(state, action) {
      const id = action.payload.id;
      const user = action.payload;

      return state.map((x) => (x.id !== id ? x : user));
    },
  },
});

export const {
  appendUserToList,
  setUserList,
  removeUserFromList,
  replaceUserInList,
} = userListSlice.actions;

export const initializeAllUsers = () => {
  return async (dispatch) => {
    const data = await userService.getAll();
    dispatch(setUserList(data));
  };
};

export const removeUser = (username, user) => {
  return async (dispatch) => {
    try {
      await userService.remove(username, user);
      dispatch(removeUserFromList(username));
    } catch (error) {
      dispatch(setNotification(error.response.data.error, "danger", 5));
    }
  };
};

export const createUser = (content) => {
  return async (dispatch) => {
    const newUser = await userService.create(content);
    dispatch(appendUserToList(newUser));
  };
};

export const promoteUser = (username, user) => {
  return async (dispatch) => {
    console.log("Calling with", user);
    try {
      const updatedUser = await userService.promoteUser(username, user);
      dispatch(replaceUserInList(updatedUser));
    } catch (error) {
      dispatch(setNotification(error.response.data.error, "danger", 5));
    }
  };
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  allUsers: userListSlice.reducer,
});

export default rootReducer;
