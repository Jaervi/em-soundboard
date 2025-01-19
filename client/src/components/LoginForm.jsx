import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../reducers/userReducer";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const LoginForm = () => {
  const user = useSelector(({ userData }) => {
    return userData.user;
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(loginUser(username, password));
    setUsername("");
    setPassword("");
  };
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logoutUser());
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>
            Logged in with {user.username} ({user.name})
          </h2>
          <Button variant='info' onClick={handleLogout}>Log out</Button>
        </div>
      ) : (
        <div>
          <h2>Log in for additional functionality</h2>
          <Form onSubmit={handleLogin} value={username} style={{width: '18rem'}}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                placeholder="Enter username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </Form.Group>
            <Button type="submit">login</Button>
          </Form>
        </div>
      )}
    </div>
  );
};
export default LoginForm;
