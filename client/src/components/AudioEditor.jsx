import { useEffect, useRef, useState } from "react"
import Button from "react-bootstrap/esm/Button"
import ProgressBar from 'react-bootstrap/ProgressBar';

const AudioEditor = ({file, posX = 0}) => {
  const [x, setX] = useState(posX)
  const [cur, setCur] = useState(0)
  const [translate, setTranslate] = useState(0)
  const fontSize = 32
  const draggedRef = useRef(false)
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
    setTranslate(95)
    audio.play()
  }

  const handlePause = () => {
    const audio = audioRef.current
    audio.pause()
  }

  const handleDragStart = (e) => {
    draggedRef.current = e.target
    console.log("Drag started");
  }

  // TODO: Drop doesnt affect progress bar, only the drag icon
  const handleDrop = (e) => {
    e.preventDefault()
    const audio = audioRef.current
    // Calculates x coordinate with help of "editAudioDiv" and fontSize
    const xCoord = e.clientX - document.getElementById("editAudioDiv").getBoundingClientRect().x - (fontSize / 2)
    
    const percentage = (xCoord / e.target.clientWidth) * 100
    setTranslate(percentage)
    setX(0)
    audio.currentTime = (percentage / 100) * audio.duration
    console.log(`Dropped at ${percentage}%, audio current time: ${audio.currentTime}`)
    } 

  return (
    <div id="editAudioDiv">
      <Button variant="primary" onClick={handlePlay}>Increase transform</Button>
      <div style={{ marginTop: 10}}>
        <ProgressBar now={cur} max={x} id="ProgressBar"/>
        <div style={{ width: "100%"}} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
          <div style={{translate: `${translate}%` , transition: `${x}s linear`, fontSize: fontSize }} onDragStart={handleDragStart} draggable="true">&#10061;</div>
        </div>
      </div>
      <Button variant="secondary" onClick={handlePause}>Pause</Button>
      <span id="tracktime">0</span>
    </div>
  )
}

export default AudioEditor