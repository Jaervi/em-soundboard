import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createEntry } from "../reducers/entryReducer";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const EntryForm = () => {
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const addEntry = (event) => {
    event.preventDefault();
    dispatch(createEntry({ author, description, file }));
    setAuthor("");
    setDescription("");
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
