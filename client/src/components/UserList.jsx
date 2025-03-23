import { useSelector, useDispatch } from "react-redux";
import { removeUser, promoteUser, createUser } from "../reducers/userReducer";
import { useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export const User = ({ user, deleteFunc = undefined, promoteFunc = undefined, currentUser }) => {
  const [more, setMore] = useState(false)

  const deleteUser = (event) => {
    event.preventDefault();
    deleteFunc(user.username);
  };
  const promoteUser = (event) => {
    event.preventDefault();
    promoteFunc(user.username);
  };
  return (
    <div>
      <Card style={{ width: '24rem', padding: '0.25rem', marginBottom: '0.25rem'}} className="bg-body-tertiary">
      <Card.Header style={{fontSize: 20}}>
        {user.username}
        <Button variant="primary" onClick={() => setMore(!more)} style={{float: "right" }}>{more ? "Shrink" : "Expand"}</Button>
      </Card.Header>
      {more && <Card.Body>
        <Card.Text>Name: {user.name}</Card.Text>
        <Card.Text>Entries uploaded: {user.entries.length}</Card.Text>
        <Card.Text>Downloads used: {user.downloads}</Card.Text>
        {deleteFunc && <Button onClick={deleteUser} variant="danger" disabled={!currentUser.admin} > Delete user </Button>}
        {promoteFunc && !user.admin && <Button onClick={promoteUser} variant="primary" disabled={!currentUser.admin} className="ms-2"> Make admin </Button>}
      </Card.Body>}
    </Card>
    </div>
  );
};

const UserForm = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const addUser = async (event) => {
    event.preventDefault();
    console.log("Creating new user with", username, name, password);
    dispatch(createUser({ username, name, password }));
    setUsername("");
    setName("");
    setPassword("");
  };

  return (
    <div>
      <h3>Create a new user</h3>
      <form onSubmit={addUser}>
        <div>
          Username:
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Name:
          <input
            type="text"
            value={name}
            name="Name"
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Add user</button>
      </form>
    </div>
  );
};

const UserList = ({ user }) => {
  const dispatch = useDispatch();

  const users = useSelector(({ userData }) => {
    return userData.allUsers;
  });

  const currentUser = useSelector(({ userData }) => {
    return userData.user;
  });

  const deleteUser = (username) => {
    dispatch(removeUser(username, currentUser));
  };
  const elevateUser = (username) => {
    dispatch(promoteUser(username, currentUser));
  };
  return (
      <div>
        <h2>List of users</h2>
        {users.map((user) => (
          <User
            key={user.id}
            user={user}
            deleteFunc={deleteUser}
            promoteFunc={elevateUser}
            currentUser={currentUser}
          />
        ))}
        {currentUser?.admin &&
          <UserForm />
        }
      </div>
  );
};

export default UserList;
