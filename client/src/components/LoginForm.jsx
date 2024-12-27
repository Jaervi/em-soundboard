import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "../reducers/userReducer";
import { useSelector } from "react-redux";


const LoginForm = () => {

  const user = useSelector(({ userData }) => {
    return userData.user;
  })

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  
  const handleLogin = async (event) => {
      event.preventDefault();
      dispatch(loginUser(username, password));
      setUsername("");
      setPassword("");
    }
    const handleLogout = (event) => {
      event.preventDefault();
      dispatch(logoutUser());
    };

  return(
    <div>
      { user ? (
        <div>
          <h2>Logged in with {user.username} ({user.name})</h2>
          <button onClick={handleLogout}>Log out</button> 
        </div>
      ) : (
        <div>
        <h2>Log in for additional functionality</h2>
        <form onSubmit={handleLogin}>
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
            Password:
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
        </div>
      )}
    </div>
  )
}
export default LoginForm

