import { useState, useRef } from "react";

const EntryForm = ({createEntry}) => {

    const [author, setAuthor] = useState("")
    const [description, setDescription] = useState("")
    const [audioURL, setAudioURL] = useState(null)

    const fileInputRef = useRef(null);

    const addEntry = (event) => {
        event.preventDefault()
        createEntry({author,description, audio : audioURL})
        setAuthor("")
        setDescription("")
        setAudioURL(null)

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    }

    const handleFileChange = (event) => {
      const file = event.target.files[0]
      if (file && file.type.startsWith("audio/")){
        const url = URL.createObjectURL(file);
        setAudioURL(url);
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