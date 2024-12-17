import { createSlice } from "@reduxjs/toolkit";

const baseData = [
    {
      author : "Ekin moniste 1",
      description : "test1",
      audio : "/sounds/babypark.mp3",
      id: "56c1a96d-76c2-4ebb-b971-969ad9d0eacb"

    },
    {
      author : "Latvalan kauhu",
      description : "test2",
      audio : "/sounds/babypark.mp3",
      id : "51a22db8-9364-4cf6-8785-46c6ca81c2d2"

    },
    {
      author : "Sepin vastaisku",
      description : "test3",
      audio : "/sounds/finlandia.mp3",
      id : "bd2d32e3-9be1-4938-88f9-4c98cf243626"
    }
  ]

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
        dispatch(setEntries(baseData))
    }
}

export const createEntry = (content) => {
    return async (dispatch) => {
      /*const newBlog = await blogService.create(content);
      newBlog.user = user;*/
      const newEntry = content
      newEntry.id = crypto.randomUUID()
      dispatch(appendEntry(newEntry));
    };
  };

  export const deleteEntry = (id) => {
    return async (dispatch) => {
      //await blogService.remove(id);
      dispatch(removeEntry(id));
    };
  };

export default entrySlice.reducer