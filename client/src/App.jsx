import { useDispatch } from "react-redux"
import EntryList from "./components/EntryList"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import { initializeEntries } from "./reducers/entryReducer"
import { useEffect } from "react"
import EntryForm from "./components/EntryForm"



const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeEntries());
  });

  return (
    <div>
      <Notification/>
      <h1>Excuse Me Soundboard (coming soon)</h1>
      <EntryList/>
      <EntryForm/>
      <LoginForm/>
    </div>
  )
}

export default App
