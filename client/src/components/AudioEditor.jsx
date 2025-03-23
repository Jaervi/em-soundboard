import { useEffect, useRef, useState } from "react"
import Button from "react-bootstrap/esm/Button"

const AudioEditor = ({file, posX = 0}) => {
  const [x, setX] = useState(posX)
  const [cur, setCur] = useState(0)
  const [translate, setTranslate] = useState(0)
  const audioRef = useRef(new Audio(URL.createObjectURL(file)))

  useEffect(() => {
    const audio = audioRef.current
    audio.addEventListener("ended", () => {
      setTranslate(0)
      setX(0)
    })
    audio.addEventListener("pause", () => {
      setCur(audio.currentTime)
      setTranslate((100 / audio.duration) * audio.currentTime)
      setX(0)
      console.log(`Pausing audio at ${audio.currentTime}, ${audio.paused}`)
    })
    audio.ontimeupdate = () => {
      console.log(`Time: ${audio.currentTime}`)
      setCur(audio.currentTime)
      document.getElementById('tracktime').innerHTML = `${audio.currentTime} s`
    }
  }, [file])
  

  const handlePlay = () => {
    const audio = audioRef.current
    console.log(x, `Audio duration ${cur}, translate: ${(100 / audio.duration) * cur}%, cur:${cur}, transition:${x}s`)
    setCur(audio.currentTime)
    setX(Number(audio.duration))
    setTranslate(100)
    audio.play()
  }

  const handlePause = () => {
    const audio = audioRef.current
    audio.pause()
  }

  return (
    <div id="editAudioDiv">
      <Button variant="primary" onClick={handlePlay}>Increase transform</Button>
      <p style={{translate: `${translate}%` , transition: `${x}s linear`}}>audio editor dot</p>
      <Button variant="secondary" onClick={handlePause}>Pause</Button>
      <span id="tracktime">0</span>
    </div>
  )
}

export default AudioEditor