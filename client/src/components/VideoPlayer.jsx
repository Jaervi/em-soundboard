import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Youtube from 'react-youtube';
import Container from 'react-bootstrap/esm/Container';

const VideoPlayer = ({ time, link, handler, height }) => {
  const { start, end } = time;
  const [player, setPlayer] = useState(null);
  const width = height * (1920 / 1080);

  const opts = {
    height: height,
    width: width,
    playerVars: {
      // More vars in https://developers.google.com/youtube/player_parameters
      start: start.s + start.m * 60,
      end: end.s + end.m * 60
    }
  };

  const handleStart = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      // Rounds the time to integer
      let newTime = { 
        start: { ...time.start },
        end: { ...time.end }
      };
      newTime.start.s = currentTime % 60 | 0;
      newTime.start.m = (currentTime / 60) | 0;
      handler(newTime);
    }
  };

  const handleEnd = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      // Rounds the time to integer
      let newTime = { 
        start: { ...time.start },
        end: { ...time.end }
      };
      newTime.end.s = currentTime % 60 | 0;
      newTime.end.m = (currentTime / 60) | 0;
      handler(newTime);
    }
  };

  return (
    <Container fluid>
      <div
        style={{
          background: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10
        }}
      >
        <Youtube
          videoId={link.split('=')[1]}
          opts={opts}
          onReady={({ target }) => setPlayer(target)}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginLeft: 10, marginBottom: 10 }}>
        <Button type="button" onClick={handleStart}>
          Add Start time
        </Button>
        <Button type="button" onClick={handleEnd}>
          Add End time
        </Button>
      </div>
    </Container>
  );
};

export default VideoPlayer;
