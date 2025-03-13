import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createEntry, createEntryExternal } from "../reducers/entryReducer";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Overlay from 'react-bootstrap/Overlay';
import { setNotification } from "../reducers/notificationReducer";
import VideoPlayer from "./VideoPlayer"

const EntryForm = () => {
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [startS, setStartS] = useState(0)
  const [startM, setStartM] = useState(0)
  const [endS, setEndS] = useState(0)
  const [endM, setEndM] = useState(0)
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [showVideo, setShowVideo] = useState(false)

  const fileInputRef = useRef(null);
  const showVideoButtonRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTag = () => {
    setTags(tags.concat(tag));
    setTag("");
  }

  const resetInputFields = () => {
    setAuthor("");
    setDescription("");
    setFile(null);
    setTags([]);
    setTag("");
    setLink("");
    setStartS(0);
    setEndS(0);
    setStartM(0);
    setEndM(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const addEntry = (event) => {
    event.preventDefault();
    if (file && author !== "" && description !== "") {
      dispatch(createEntry({ author, description, file, tags }));
      resetInputFields()
    } else if (showVideo && link !== "" && author !== "" && description !== ""){
      const start = startS + 60 * startM
      const end = endS + 60 * endM
      dispatch(createEntryExternal({ author, description, link, tags, start, end}))
      resetInputFields()
    } else {
      dispatch(setNotification(`Incorrect input`, "danger", 10));
    }
  };

  const TimeFormInput = ({label, value, handler, controlId}) => {
    return (
      <Form.Group as={Col} className="mb-3" controlId={controlId} >
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="number"
          value={value}
          onChange={({ target }) => handler(Number(target.value))}
        />
      </Form.Group>
    )
  }

  return (
    <div>
      <h2>Add entry</h2>
      <Form onSubmit={addEntry} style={{ width: "18rem" }}>
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
          <Form.Control
            type="text"
            value={tag}
            onChange={({ target }) => setTag(target.value)}
          />
          <Button variant="primary" type="button" onClick={handleTag}>Add tag</Button>
          {tags.length !== 0 && <div>Tags so far: {tags.map(x => ` ${x}`).toString()}</div>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFile" style={{width: '24rem'}}>
          <Form.Label>Audio file</Form.Label>
          <Form.Control
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formExternalLink" style={{width: '24rem'}}>
          <Form.Label>External Link (Youtube etc.)</Form.Label>
          <Form.Control
            type="text"
            value={link}
            onChange={({ target }) => setLink(target.value)}
          />
        </Form.Group>
        <Row style={{width: "24rem"}}>
          <TimeFormInput label={"Start minute"} value={startM} handler={setStartM} controlId={"formVideoStartM"} />
          <TimeFormInput label={"Start second"} value={startS} handler={setStartS} controlId={"formVideoStartS"} />
          <TimeFormInput label={"End minute"} value={endM} handler={setEndM} controlId={"formVideoEndM"} />
          <TimeFormInput label={"End second"} value={endS} handler={setEndS} controlId={"formVideoEndS"} />
        </Row>
        <Button variant="primary" type="button" onClick={() => setShowVideo(!showVideo)} >{showVideo ? "Hide video" : "View video"}</Button>
        
        <Overlay target={showVideoButtonRef.current} show={showVideo} placement="right">
          {({
            placement: _placement,
            arrowProps: _arrowProps,
            show: _show,
            popper: _popper,
            hasDoneInitialMeasure: _hasDoneInitialMeasure,
            ...props
          }) => (
            <div
              {...props}
              style={{
                position: 'absolute',
                backgroundColor: 'rgb(248, 249, 250)',
                padding: '10px 10px',
                color: 'white',
                borderRadius: 3,
                marginLeft: '-50%',
                boxShadow: 'shadow-lg', // doesnt seem to work
                ...props.style,
              }}
            >
              {showVideo && link !== "" && 
                <VideoPlayer start={{s: startS, m: startM}} end={{s: endS, m: endM}} link={link} setStart={{s: setStartS, m: setStartM}} setEnd={{s: setEndS, m: setEndM}}/>
              }
            </div>
          )}
        </Overlay>
        <Button variant='success' type="submit">Add entry</Button>
      </Form>
    </div>
  );
};

export default EntryForm;
