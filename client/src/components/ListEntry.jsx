import { useDispatch, useSelector } from "react-redux";
import AudioPlayer from "./AudioPlayer";
import { deleteEntry } from "../reducers/entryReducer";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const ListEntry2 = ({ id, author, description, audio }) => {
  const dispatch = useDispatch();

  const removeEntry = (event) => {
    event.preventDefault();
    dispatch(deleteEntry({ id, audio }));
  };

  return (
    <div>
      <p>
        {author} ({description})
      </p>
      <AudioPlayer audioName={audio} />
      <button onClick={removeEntry}>Delete the entry</button>
    </div>
  );
};

const ListEntry = ({ id, author, description, audio, user = {username: "unknown"}, tags = [], stats, handleLike, handleDownload }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(({ userData }) => {
      return userData.user;
    });

  const removeEntry = (event) => {
    event.preventDefault();
    dispatch(deleteEntry({ id, audio }));
  };

  return (
    <Card style={{ width: '24rem', padding: '0.25rem', marginBottom: '0.25rem'}}>
      <Card.Body>
        <Card.Title>{author}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Posted by {user.username}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        {tags.length !== 0 && <Card.Text>Tags: {tags.map(x => ` #${x}`).toString()}</Card.Text>}
        {stats && <Card.Text>Likes: {stats.likes}, Downloads: {stats.downloads}</Card.Text>}
        <Button variant="success" onClick={handleLike} style={{ marginBottom: '0.25rem'}}>Like</Button>
        <AudioPlayer audioName={audio} handleDownload={handleDownload}/>
        {(currentUser.username === user.username || currentUser.admin) && <Button variant="danger" size="sm" onClick={removeEntry}>Delete the entry</Button>}
      </Card.Body>
    </Card>
  );
};

export default ListEntry;
