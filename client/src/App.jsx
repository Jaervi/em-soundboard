import { useDispatch, useSelector } from "react-redux";
import EntryList from "./components/EntryList";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import UserList from "./components/UserList";
import { initializeEntries } from "./reducers/entryReducer";
import { initializeAllUsers, initializeUser } from "./reducers/userReducer";
import { useEffect } from "react";
import EntryForm from "./components/EntryForm";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeEntries());
  }, []);
  useEffect(() => {
    dispatch(initializeUser());
  }, []);
  useEffect(() => {
    dispatch(initializeAllUsers());
  }, []);

  const user = useSelector(({ userData }) => {
    return userData.user;
  });
  return (
    <div className="container">
      <Notification />
      <h1>Excuse Me Soundboard (coming soon)</h1>
      <EntryList />
      {user && <EntryForm />}
      <LoginForm />
      {user?.admin && (
        <div>
          <UserList />
        </div>
      )}
    </div>
  );
};

export default App;
