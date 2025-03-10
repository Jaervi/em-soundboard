import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createEntry } from "../reducers/entryReducer";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { setNotification } from "../reducers/notificationReducer";

const EntryForm = () => {
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
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

  const addEntry = (event) => {
    event.preventDefault();
    if (file && author !== "" && description !== "") {
      dispatch(createEntry({ author, description, file, tags }));
      setAuthor("");
      setDescription("");
      setFile(null);
      setTags([]);
      setTag("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
          <div>Tags so far: {tags.map(x => ` ${x}`).toString()}</div>
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
        <Button variant='success' type="submit">Add entry</Button>
      </Form>
    </div>
  );
};

export default EntryForm;
