import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";
import entryReducer from "./reducers/entryReducer"


//TODO: Implement
const store = configureStore({
    reducer: {
        notificationText: notificationReducer,
        userData: userReducer,
        entries: entryReducer,
    },
  });
  
  export default store;
  