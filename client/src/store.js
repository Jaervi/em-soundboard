import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";


//TODO: Implement
const store = configureStore({
    reducer: {
        notificationText: notificationReducer,
    },
  });
  
  export default store;
  