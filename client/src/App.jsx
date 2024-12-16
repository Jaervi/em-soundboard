import { useDispatch } from "react-redux"
import EntryList from "./components/EntryList"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import { createEntry, initializeEntries } from "./reducers/entryReducer"
import { useEffect } from "react"
import EntryForm from "./components/EntryForm"



const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeEntries());
  }, []);

  const createNewEntry = async (newEntry) => {
    dispatch(createEntry(newEntry))
  }

  return (
    <div>
      <Notification/>
      <h1>Excuse Me Soundboard (coming soon)</h1>
      <EntryList/>
      <EntryForm createEntry={createNewEntry}/>
      <LoginForm/>
    </div>
  )
}

export default App
