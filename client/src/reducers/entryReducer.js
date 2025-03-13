import { createSlice } from "@reduxjs/toolkit";
import entryService from "../services/entries";
import fileService from "../services/files";
import { setNotification } from "./notificationReducer";

const entrySlice = createSlice({
  name: "entries",
  initialState: [],
  reducers: {
    appendEntry(state, action) {
      state.push(action.payload);
    },
    setEntries(state, action) {
      return action.payload;
    },
    removeEntry(state, action) {
      return state.filter((entry) => entry.id != action.payload);
    },
  },
});

export const { appendEntry, setEntries, removeEntry } = entrySlice.actions;

//Waiting for DB functionality

export const initializeEntries = () => {
  return async (dispatch) => {
    const data = await entryService.getAll();
    dispatch(setEntries(data));
  };
};

export const createEntry = (content) => {
  return async (dispatch) => {
    /*const newBlog = await blogService.create(content);
      newBlog.user = user;*/

    //Send file to S3
    dispatch(setNotification(`Sending file to the cloud...`), "success", 10);
    const key = await fileService.uploadFile(content.file);

    //Send text data to MongoDB
    dispatch(setNotification(`Updating the database...`), "success", 10);
    const newEntry = await entryService.create({
      author: content.author,
      description: content.description,
      audio: key,
      tags: content.tags
    });
    dispatch(appendEntry(newEntry));
    dispatch(setNotification(`${content.description} uploaded successfully!`, "success"));
  };
};

export const createEntryExternal = (content) => {
  return async (dispatch) => {
    //Send file to downloader
    dispatch(setNotification(`Downloading audio...`), "success", 10);
    const key = await fileService.sendForDownload(content.link, content.start, content.end)

    //Send text data to MongoDB
    dispatch(setNotification(`Download complete. Updating the database...`), "success", 10);
    const newEntry = await entryService.create({
      author: content.author,
      description: content.description,
      audio: key,
      tags: content.tags
    });
    dispatch(appendEntry(newEntry));
    dispatch(setNotification(`${content.description} uploaded successfully!`, "success"));
  }
}

export const deleteEntry = (entry) => {
  return async (dispatch) => {
    //Remove file from S3
    await fileService.removeFile(entry.audio);

    //Remove text data from MongoDB
    await entryService.remove(entry.id);

    //Remove data from session storage
    dispatch(removeEntry(entry.id));
  };
};

export default entrySlice.reducer;
