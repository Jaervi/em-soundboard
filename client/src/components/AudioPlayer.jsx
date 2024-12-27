import { useState } from "react";
import fileService from "../services/files"



const AudioPlayer = ({audioName}) =>{ 

  const [loaded, setLoaded] = useState(false)
  const [audioURL, setAudioURL] = useState("")

  const toggleLoaded = async () =>{
    const newURL = await fileService.getFileURL(audioName)
    setAudioURL(newURL)
    setLoaded(true)
  }
  
  /* Dunno which one is better, html simple and easy but howler offers more functionality?? */
  return (
    <div>
    { !loaded ? (
        <button onClick={toggleLoaded}> Load audio </button>
    ) : (
      <audio controls>
        <source src={audioURL} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    )
    }
    </div>
    
  )
}

export default AudioPlayer