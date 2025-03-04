import { useState } from "react";
import fileService from "../services/files";
import Button from 'react-bootstrap/Button';


const AudioPlayer = ({ audioName }) => {
  const [audioURL, setAudioURL] = useState(null);

  const toggleLoaded = async () => {
    const newURL = await fileService.getFileURL(audioName);
    setAudioURL(newURL);
  };

  /* Dunno which one is better, html simple and easy but howler offers more functionality?? */
  return (
    <div>
      {!audioURL ? (
        <Button style={{ marginBottom: '0.25rem'}} variant="primary" onClick={toggleLoaded}> Load audio </Button>
      ) : (
        <audio controls>
          <source src={audioURL} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;
