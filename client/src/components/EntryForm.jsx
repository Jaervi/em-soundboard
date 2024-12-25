import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createEntry } from "../reducers/entryReducer";

const EntryForm = () => {

    const [author, setAuthor] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState(null)

    
    const fileInputRef = useRef(null);
    const dispatch = useDispatch()
    
    const handleFileChange = (event) => {
      setFile(event.target.files[0])
    }

    const addEntry = (event) => {
        event.preventDefault()
        dispatch(createEntry({ author, description, file }))
        setAuthor("")
        setDescription("")
        setFile(null)

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    }



    return(
        <div>
        <h2>Add entry</h2>
        <form onSubmit={addEntry}>
          <div>
            Author:
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            Description:
            <input
              type="text"
              value={description}
              name="Password"
              onChange={({ target }) => setDescription(target.value)}
            />
          </div>
          <div>
            <input type="file" accept="audio/*" onChange={handleFileChange} ref={fileInputRef} />  
          </div>
          <button type="submit">Add</button>
        </form>
        </div>
    )
}

export default EntryForm