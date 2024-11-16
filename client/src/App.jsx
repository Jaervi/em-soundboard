import ListEntry from "./components/ListEntry"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"

const baseData = [
  {
    title : "Ekin moniste 1",
    path : "test1",
    id: 1
  },
  {
    title : "Latvalan kauhu",
    path : "test2",
    id : 2
  },
  {
    title : "Sepin vastaisku",
    path : "test3",
    id : 3
  }
]

function App() {

  return (
    <div>
      <Notification/>
      <h1>Excuse Me Soundboard (coming soon)</h1>
      {baseData.map(x => (<ListEntry key = {x.id} title = {x.title} path={x.path}/>))}
      <LoginForm/>
    </div>
  )
}

export default App
