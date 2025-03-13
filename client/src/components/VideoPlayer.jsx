import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Youtube from 'react-youtube';

const VideoPlayer = ({start, end, link, setStart, setEnd}) => {
  const [player, setPlayer] = useState(null);

  const opts = {
    height: '315',
    width: '420',
    playerVars: {
      // More vars in https://developers.google.com/youtube/player_parameters
      start: (start.s + start.m * 60),
      end: (end.s + end.m * 60),
    },
  };

  const handleStart = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      // Rounds the time to integer
      setStart.s((currentTime % 60) | 0);
      setStart.m((currentTime / 60) | 0)
    }
  }

  const handleEnd = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      // Rounds the time to integer
      setEnd.s((currentTime % 60) | 0);
      setEnd.m((currentTime / 60) | 0)
    }
  }

  return (
    <div>
      <Youtube videoId={link.split('=')[1]} opts={opts} onReady={({ target }) => setPlayer(target)}/>
      <Button type='button' onClick={handleStart}>Add Start time</Button>
      <Button type='button' onClick={handleEnd}>Add End time</Button>
    </div>
  )
}

export default VideoPlayer