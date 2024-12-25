import { Howl } from "howler"
import { useState, useEffect } from "react";
import fileService from "../services/files"



const AudioPlayer = ({audioName}) =>{ 

  const disableAudioButton = true //Debugging purposes

  const [isPlaying, setIsPlaying] = useState(false)
  const [sound, setSound] = useState(null)

  const [loaded, setLoaded] = useState(false)
  const [audioURL, setAudioURL] = useState("")

  useEffect(() => {
    const newSound = new Howl({
      src: [audioName],
      html5: true,
      onend: () => {
        // Automatically set state to not playing when the sound ends
        setIsPlaying(false);
      },
    })
    setSound(newSound);
    return () => {
      newSound.unload();
    };
  }, [audioName]);

  const playSound = () => {
    if (sound) {
      sound.play()
      setIsPlaying(true)
    }
  }

  const stopSound = () => {
    if (sound) {
      sound.stop()
      setIsPlaying(false)
    }
  }
  const toggleLoaded = async () =>{
    const newURL = await fileService.getFileURL(audioName)
    setAudioURL(newURL)
    setLoaded(true)
  }
  
  /* Dunno which one is better, html simple and easy but howler offers more functionality?? */
  return (
    <div>
      { !disableAudioButton &&
        <button onClick={isPlaying ? stopSound : playSound}>
          {isPlaying ? "Stop Sound" : "Play Sound"}
        </button>
      }
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