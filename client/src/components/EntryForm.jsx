import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createEntry, createEntryExternal } from "../reducers/entryReducer";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { setNotification } from "../reducers/notificationReducer";

const EntryForm = () => {
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [embeddedLink, setEmbeddedLink] = useState(null);
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTag = () => {
    setTags(tags.concat(tag));
    setTag("");
  }

  const handleLink = () => {
    const trimmed = link.split('=')[1];
    setEmbeddedLink(`https://www.youtube.com/embed/${trimmed}`);
  }

  const resetInputFields = () => {
    setAuthor("");
    setDescription("");
    setFile(null);
    setTags([]);
    setTag("");
    setLink("");
    setStart(0);
    setEnd(0);
    setEmbeddedLink(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const addEntry = (event) => {
    event.preventDefault();
    if (file && author !== "" && description !== "") {
      dispatch(createEntry({ author, description, file, tags }));
      resetInputFields()
    } else if (embeddedLink && link !== "" && author !== "" && description !== ""){
      dispatch(createEntryExternal({ author, description, link, tags, start, end}))
      resetInputFields()
    } else {
      dispatch(setNotification(`Incorrect input`, "danger", 10));
    }
  };

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
        <Form.Group className="mb-3" controlId="formVideoStart" style={{width: '24rem'}}>
          <Form.Label>Start time</Form.Label>
          <Form.Control
            type="number"
            value={start}
            onChange={({ target }) => setStart(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formVideoEnd" style={{width: '24rem'}}>
          <Form.Label>End time</Form.Label>
          <Form.Control
            type="number"
            value={end}
            onChange={({ target }) => setEnd(target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="button" onClick={handleLink} >View video</Button>
        {embeddedLink && <iframe width="420" height="315" src={`${embeddedLink}?start=${start}` + (end > start ? `&end=${end}` : "")}/>}
        <Button variant='success' type="submit">Add entry</Button>
      </Form>
    </div>
  );
};

export default EntryForm;
