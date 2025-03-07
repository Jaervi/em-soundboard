import { useSelector, useDispatch } from "react-redux";
import { removeUser, promoteUser, createUser } from "../reducers/userReducer";
import { useState } from "react";

const User = ({ user, deleteFunc, promoteFunc, currentUser }) => {
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
      <p>
        {user.name} ({user.username}) Admin: {user.admin.toString()}
      </p>
      {currentUser?.admin &&
        <div>
          <button onClick={deleteUser}> Delete user </button>
          <button onClick={promoteUser}> Make admin </button>
        </div>
      }
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
      {currentUser ?
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
      :
      <p>Log in to view users</p>}
    </div>
  );
};

export default UserList;
