import { createSlice } from "@reduxjs/toolkit";
import entryService from "../services/entries"


const entrySlice = createSlice({
    name: "entries",
    initialState: [],
    reducers : {
        appendEntry(state, action) {
            state.push(action.payload);
          },
          setEntries(state, action) {
            return action.payload;
          },
          removeEntry(state, action) {
            return state.filter((entry) => entry.id != action.payload);
          },
    }
})

export const { appendEntry, setEntries, removeEntry} = entrySlice.actions

//Waiting for DB functionality

export const initializeEntries = () => {
    return async (dispatch) => {
      const data = await entryService.getAll()
        dispatch(setEntries(data))
    }
}

export const createEntry = (content) => {
    return async (dispatch) => {
      /*const newBlog = await blogService.create(content);
      newBlog.user = user;*/
      const newEntry = await entryService.create(content)
      dispatch(appendEntry(newEntry));
    };
  };

  export const deleteEntry = (id) => {
    return async (dispatch) => {
      await entryService.remove(id);
      dispatch(removeEntry(id));
    };
  };

export default entrySlice.reducer