import { useState } from "react";

const EntryForm = ({createEntry}) => {

    const [author, setAuthor] = useState("")
    const [description, setDescription] = useState("")

    const addEntry = (event) => {
        event.preventDefault()
        createEntry({author,description})
        setAuthor("")
        setDescription("")
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
          <button type="submit">Add</button>
        </form>
        </div>
    )
}

export default EntryForm