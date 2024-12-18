import { useDispatch } from "react-redux"
import AudioPlayer from "./AudioPlayer"
import { deleteEntry } from "../reducers/entryReducer"

const ListEntry = ({id, author, description, audio}) => {

    const dispatch = useDispatch()

    const removeEntry = (event) => {
        event.preventDefault()
        dispatch(deleteEntry(id))
      }

    return(
        <div>
        <p>{author} ({description})</p>
        <AudioPlayer audioName={audio}/>
        <button onClick={removeEntry}>Delete {id}</button>
        </div>
    )
}

export default ListEntry