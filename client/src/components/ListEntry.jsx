import AudioPlayer from "./AudioPlayer"
const ListEntry = ({author, description, audio}) => {

    return(
        <div>
        <p>{author} ({description})</p>
        <AudioPlayer audioName={audio}/>
        </div>
    )
}

export default ListEntry