import { Howl } from "howler"
import { useState, useEffect } from "react";


const AudioPlayer = ({audioName}) =>{ 

  const [isPlaying, setIsPlaying] = useState(false)
  const [sound, setSound] = useState(null)

  useEffect(() => {
    const newSound = new Howl({
      src: [`/sounds/${audioName}.mp3`],
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
  
  /* Dunno which one is better, html simple and easy but howler offers more functionality?? */
  return (
    <div>
      <button onClick={isPlaying ? stopSound : playSound}>
        {isPlaying ? "Stop Sound" : "Play Sound"}
      </button>
    <audio controls>
      <source src={audioName} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    </div>
    
  )
}

export default AudioPlayer