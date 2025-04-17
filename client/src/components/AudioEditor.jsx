import { useEffect, useRef, useState } from "react"
import Button from "react-bootstrap/esm/Button"
import { setNotification } from '../reducers/notificationReducer';
import { useDispatch } from "react-redux";

const AudioEditor = ({file, posX = 0, audioTime, setAudioTime, setShowEdit}) => {
  const [audioDuration, setAudioDuration] = useState(posX)
  const fontSize = 32
  const translateWidth = 95
  const [translate, setTranslate] = useState(0)
  const [translateEnd, setTranslateEnd] = useState(translateWidth)
  const draggedRef = useRef(false)
  const audioRef = useRef(new Audio(URL.createObjectURL(file)))
  const dispatch = useDispatch()

  const audioToTranslate = (time, duration) => {
    return (time / duration) * translateWidth
  }
  const translateToAudio = (translate, duration) => {
    return (translate / translateWidth) * duration
  }

  const roundToDecimal = (num, decimal) => {
    return parseFloat(num.toFixed(decimal))
  }

  useEffect(() => {
    const audio = audioRef.current
    document.getElementById('tracktime').innerHTML = `start: ${audio.currentTime} s, end: ${(translateEnd / translateWidth) * audio.duration}`
    audio.addEventListener("loadedmetadata", () => {
      console.log("Audio loaded", audio.duration)
      setTranslate(roundToDecimal(audioToTranslate(audioTime.start, audio.duration), 2))
      audio.currentTime = audioTime.start
      if (audioTime.end != 0) {
        setTranslateEnd(roundToDecimal(audioToTranslate(audioTime.end, audio.duration), 2))
      }
    })
    audio.addEventListener("ended", () => {
      console.log("Audio ended");
      setTranslate(0)
      setAudioDuration(0)
      audio.currentTime = 0
    })
    audio.addEventListener("pause", () => {
      setTranslate(audioToTranslate(audio.currentTime, audio.duration))  
      setAudioDuration(0)
      console.log(`Pausing audio at ${audio.currentTime}, ${audio.paused}`)
    })
    audio.ontimeupdate = () => {
      console.log(`Time: ${audio.currentTime}, translateEnd: ${translateEnd}`)
      document.getElementById('tracktime').innerHTML = `start: ${audio.currentTime} s, end: ${(translateEnd / translateWidth) * audio.duration}`
      if (audio.currentTime > translateEnd / translateWidth * audio.duration) {
        console.log("Audio ended, resetting")
        audio.pause()
        setTranslate(0)
        setAudioDuration(0)
        audio.currentTime = 0
      }
    }
  }, [file, translateEnd])
  

  const handlePlay = () => {
    const audio = audioRef.current
    console.log(audioDuration, `Audio duration ${audio.duration}, current time ${audio.currentTime}`)
    setAudioDuration(Number(audio.duration - audio.currentTime))
    setTranslate(translateWidth)
    audio.play()
  }

  const handlePause = () => {
    audioRef.current.pause()
  }

  const handleDragStart = (e) => {
    draggedRef.current = e.target
    console.log("Drag started");
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const audio = audioRef.current
    // Calculates x coordinate with help of "editAudioDiv" and fontSize
    const xCoord = e.clientX - document.getElementById("editAudioDiv").getBoundingClientRect().x - (fontSize / 2)
    
    const percentage = (xCoord / e.target.clientWidth) * translateWidth
    if (draggedRef.current === document.getElementById("endMarker")) {
      setTranslateEnd(percentage)
    } else {
      setTranslate(percentage)
      setAudioDuration(0)
      audio.currentTime = (xCoord / e.target.clientWidth) * audio.duration
    }
    console.log(`Dropped at ${percentage}%, audio current time: ${audio.currentTime}`)
    } 

  const handleSave = () => {
    const audio = audioRef.current
    const start = roundToDecimal(translateToAudio(translate, audio.duration), 2)
    const end = roundToDecimal(translateToAudio(translateEnd, audio.duration), 2)
    setAudioTime({
      start: start,
      end: end
    })
    dispatch(setNotification(`Saved audio time: ${start} - ${end}`))
    setShowEdit(false)
  }

  /*
  const DraggableSlider = ({ translate, transitionLen, handleDragStart = () => console.log("Drag started") }) => {
    console.log("rerendered slider", translate, transitionLen);
    
    return (
      <div style={{translate: `${translate}%` , transition: `${transitionLen}s linear`, fontSize: fontSize }} onDragStart={handleDragStart} draggable="true">&#10061;</div>
    )
  }
    */


  return (
    <div id="editAudioDiv">
      <Button variant="primary" onClick={handlePlay}>Increase transform</Button>
      <div style={{ marginTop: 10 }}>
        <div style={{ width: `${translate}%`, transition: `${audioDuration}s linear`, height: '10px', backgroundColor: 'blue' }} />
        <div style={{ width: "100%", minHeight: `${fontSize}px` }} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
          <div style={{ translate: `${translate}%`, transition: `${audioDuration}s linear`, fontSize: fontSize, position: "absolute", width: `100%` }} 
            onDragStart={handleDragStart} 
            draggable="true"
            id="currentMarker">&#10061;</div>
          <div style={{ translate: `${translateEnd}%`, fontSize: fontSize, width: `100%` }} 
            onDragStart={handleDragStart}
            draggable="true"
            id="endMarker">&#10061;</div>
        </div>
      </div>
      <Button variant="secondary" onClick={handlePause}>Pause</Button>
      <Button variant="secondary" onClick={handleSave}>Save Changes</Button>
      <span id="tracktime">0</span>
    </div>
  )
}

export default AudioEditor