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
  const [translateStart, setTranslateStart] = useState(0)
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

  const resetAudioToStart = (audio) => {
    console.log(`Resetting audio to ${translateStart}`)
    setAudioDuration(0)
    setTranslate(translateStart)
    audio.currentTime = translateToAudio(translateStart, audio.duration)
  }

  const updateAudioTimes = (audio) => {
    document.getElementById('tracktime').innerHTML = `start: ${roundToDecimal(audio.currentTime, 2)} s, end: ${roundToDecimal((translateEnd / translateWidth) * audio.duration, 2)} s`
  }

  useEffect(() => {
    const audio = audioRef.current
    updateAudioTimes(audio)

    const metaDataListener = () => {
      console.log("Audio loaded", audio.duration)
      const initialTranslate = roundToDecimal(audioToTranslate(audioTime.start, audio.duration), 2)
      setTranslate(initialTranslate)
      setTranslateStart(initialTranslate)
      audio.currentTime = audioTime.start
      if (audioTime.end != 0) {
        console.log(`Setting end time ${roundToDecimal(audioToTranslate(audioTime.end, audio.duration), 2)}`)
        setTranslateEnd(roundToDecimal(audioToTranslate(audioTime.end, audio.duration), 2))
      }
    }

    const endListener = () => {
      console.log("Audio ended")
      resetAudioToStart(audio)
    }

    const pauseListener = () => {
      setTranslate(audioToTranslate(audio.currentTime, audio.duration))  
      setAudioDuration(0)
      console.log(`Pausing audio at ${audio.currentTime}, ${audio.paused}`)
    }

    const timeUpdateListener = () => {
      console.log(`Time: ${audio.currentTime}, condition: ${audio.currentTime > translateToAudio(translateEnd, audio.duration)}, translateEnd: ${translateEnd}`)
      updateAudioTimes(audio)
      if (audio.currentTime > translateToAudio(translateEnd, audio.duration)) {
        audio.pause()
        resetAudioToStart(audio)
      }
    }

    audio.addEventListener("loadedmetadata", metaDataListener)
    audio.addEventListener("ended", endListener)
    audio.addEventListener("pause", pauseListener)
    audio.addEventListener("timeupdate", timeUpdateListener)
    return () => {
      audio.removeEventListener("loadedmetadata", metaDataListener)
      audio.removeEventListener("ended", endListener)
      audio.removeEventListener("pause", pauseListener)
      audio.removeEventListener("timeupdate", timeUpdateListener)
    }
  }, [file, translateEnd])
  

  const handlePlay = () => {
    const audio = audioRef.current
    console.log(audioDuration, `Audio duration ${audio.duration}, current time ${audio.currentTime}`)
    setAudioDuration(Number(translateToAudio(translateEnd, audio.duration) - audio.currentTime))
    setTranslate(translateEnd)
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
    const dragDivWidth = document.getElementById("dragDiv").clientWidth
    const percentage = (xCoord / dragDivWidth) * 100

    const setToPercentage = (percentage) => {
      if (draggedRef.current === document.getElementById("endMarker")) {
        setTranslateEnd(percentage)
      } else {
        setTranslate(percentage)
        setAudioDuration(0)
        audio.currentTime = (xCoord / e.target.clientWidth) * audio.duration
      }
    }
    if (percentage > translateWidth) {
      // set to max
      setToPercentage(translateWidth)
      console.log("Invalid drop area")
    } else if (percentage < 0) {
      // set to min
      setToPercentage(0)
      console.log("Invalid drop area")
    } else {
      setToPercentage(percentage)
    }
    console.log(`Dropped at ${roundToDecimal(percentage, 2)}% with xCoord: ${roundToDecimal(xCoord, 2)}, audio current time: ${audio.currentTime}`)
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
    setTranslateStart(translate)
  }

  const resetTranslates = () => {
    setTranslate(0)
    setTranslateStart(0)
    setTranslateEnd(translateWidth)
    setAudioDuration(0)
    audioRef.current.currentTime = 0
  }

  return (
    <div id="editAudioDiv">
      <div style={{ marginTop: 10 }}>
        <div style={{ width: `${translate}%`, transition: `${audioDuration}s linear`, height: '10px', backgroundColor: 'blue' }} />
        <div id={"dragDiv"} style={{ width: `${translateWidth}%`, minHeight: `${fontSize}px` }} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
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
      <div style={{display: "flex", justifyContent: "space-between", paddingTop: "10px", columnGap: "10px"}}>
        <Button variant="primary" onClick={handlePlay}>Play audio</Button>
        <Button variant="secondary" onClick={handlePause}>Pause</Button>
        <span id="tracktime">0</span>
        <Button variant="secondary" onClick={resetTranslates}>Reset</Button>
        <Button variant="secondary" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}

export default AudioEditor