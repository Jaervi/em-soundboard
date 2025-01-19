import { useState } from "react";
import fileService from "../services/files";
import Button from 'react-bootstrap/Button';


const AudioPlayer = ({ audioName }) => {
  const [loaded, setLoaded] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  const toggleLoaded = async () => {
    const newURL = await fileService.getFileURL(audioName);
    setAudioURL(newURL);
    setLoaded(true);
  };

  /* Dunno which one is better, html simple and easy but howler offers more functionality?? */
  return (
    <div>
      {!loaded ? (
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
