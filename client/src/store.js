import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";


//TODO: Implement
const store = configureStore({
    reducer: {
        notificationText: notificationReducer,
        user: userReducer,
    },
  });
  
  export default store;
  