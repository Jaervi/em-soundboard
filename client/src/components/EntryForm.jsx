import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createEntry, createEntryExternal } from '../reducers/entryReducer';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { setNotification } from '../reducers/notificationReducer';
import VideoPlayer from './VideoPlayer';
import AudioEditor from './AudioEditor';

const EntryForm = () => {
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [audioTime, setAudioTime] = useState({ start: 0, end: 0 })
  const [link, setLink] = useState('');
  const [videoTime, setVideoTime] = useState({ start: { m: 0, s: 0 }, end: { m: 0, s: 0 } });
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);

    setFile(event.target.files[0]);
  };

  const handleTag = () => {
    setTags(tags.concat(tag));
    setTag('');
  };

  const resetInputFields = () => {
    setAuthor('');
    setDescription('');
    setFile(null);
    setTags([]);
    setTag('');
    setLink('');
    setVideoTime({ start: { m: 0, s: 0 }, end: { m: 0, s: 0 } });
    setAudioTime({ start: 0, end: 0 })
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addEntry = (event) => {
    event.preventDefault();
    if (file && author !== '' && description !== '') {
      if (audioTime.start != 0 || audioTime.end != 0) {
        console.log(audioTime);
        
      } else {
        dispatch(createEntry({ author, description, file, tags }));
        resetInputFields();
      }
    } else if (link !== '' && author !== '' && description !== '') {
      const start = videoTime.start;
      const end = videoTime.end;
      dispatch(createEntryExternal({ author, description, link, tags, start, end }));
      resetInputFields();
    } else {
      dispatch(setNotification(`Incorrect input`, 'danger', 10));
    }
  };

  const TimeFormInput = ({ label, value, controlId, field }) => {
    const calcTimeSum = (time) => {
      return ((time.end.m * 60 + time.end.s) - (time.start.m * 60 + time.start.s));
    }
    const handleChange = (newValue) => {
      let time = { 
        start: { ...videoTime.start },
        end: { ...videoTime.end }
      };
      if (newValue >= 0 && newValue < 60) {
        time[field[0]][field[1]] = newValue;
      } else if (newValue < 0) {
        if (field[1] === 's') {
          time[field[0]]['m'] = Math.max(0, videoTime[field[0]]['m'] - 1);
        }
        time[field[0]][field[1]] = 60 + newValue;
      } else if (field[1] === 's') {
        time[field[0]]['m'] = videoTime[field[0]]['m'] + 1;
        time[field[0]][field[1]] = newValue - 60;
      }
      console.log("Videotime:", videoTime, "newTime:", time, calcTimeSum(time));
        
      if (calcTimeSum(time) > 0) {
        setVideoTime(time);
      }
    }
    return (
      <Form.Group as={Col} className="mb-3" controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="number"
          value={value}
          onChange={({ target }) => handleChange(Number(target.value))}
        />
      </Form.Group>
    );
  };

  return (
    <div>
      <h2>Add entry</h2>
      <Form onSubmit={addEntry} style={{ width: '18rem' }}>
        <Form.Group className="mb-2" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formTags">
          <Form.Label>Tags</Form.Label>
          <Form.Control type="text" value={tag} onChange={({ target }) => setTag(target.value)} onKeyDown={(e) => console.log(e.key)}
          />
          <Button variant="primary" type="button" onClick={handleTag}>
            Add tag
          </Button>
          {tags.length !== 0 && <div>Tags so far: {tags.map((x) => ` ${x}`).toString()}</div>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFile" style={{ width: '24rem' }}>
          <Form.Label>Audio file</Form.Label>
          <Form.Control
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Form.Group>

        {file && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 10, width: '30rem' }}>
            <audio controls>
              <source src={URL.createObjectURL(file)} type={file?.type || 'audio/mpeg'}></source>
              Your browser does not support the audio element.
            </audio>
            <Button variant="primary" type="button" onClick={() => setShowEdit(!showEdit)}>
              Edit audio
            </Button>
          </div>
        )}

        <Modal show={showEdit} onHide={() => setShowEdit(false)} centered size='lg'>
          {file && <div>
            <AudioEditor file={file} audioTime={audioTime} setAudioTime={setAudioTime} showEdit={showEdit} setShowEdit={setShowEdit}/>
            </div>}
        </Modal>

        <Form.Group className="mb-3" controlId="formExternalLink" style={{ width: '24rem' }}>
          <Form.Label>External Link (Youtube etc.)</Form.Label>
          <Form.Control type="text" value={link} onChange={({ target }) => setLink(target.value)} />
        </Form.Group>
        <Row style={{ width: '24rem' }}>
          <TimeFormInput
            label={'Start minute'}
            value={videoTime.start.m}
            controlId={'formVideoStartM'}
            field={['start', 'm']}
          />
          <TimeFormInput
            label={'Start second'}
            value={videoTime.start.s}
            controlId={'formVideoStartS'}
            field={['start', 's']}
          />
          <TimeFormInput
            label={'End minute'}
            value={videoTime.end.m}
            controlId={'formVideoEndM'}
            field={['end', 'm']}
          />
          <TimeFormInput
            label={'End second'}
            value={videoTime.end.s}
            controlId={'formVideoEndS'}
            field={['end', 's']}
          />
        </Row>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="primary" type="button" onClick={() => setShowVideo(!showVideo)}>
            {showVideo ? 'Hide video' : 'View video'}
          </Button>
          <Button variant="success" type="submit">
            Add entry
          </Button>
        </div>

        <Modal show={showVideo} onHide={() => setShowVideo(false)} centered={true} size="lg">
          {showVideo && link !== '' && (
            <VideoPlayer
              time={videoTime}
              link={link}
              handler={setVideoTime}
              height={420} // Set video player size here
            />
          )}
        </Modal>
      </Form>
    </div>
  );
};

export default EntryForm;
