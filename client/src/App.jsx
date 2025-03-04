import { useDispatch, useSelector } from "react-redux";
import EntryList from "./components/EntryList";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import UserList from "./components/UserList";
import Navigation from "./components/Navigation"
import { initializeEntries } from "./reducers/entryReducer";
import { initializeAllUsers, initializeUser } from "./reducers/userReducer";
import { useEffect } from "react";
import EntryForm from "./components/EntryForm";
import { Routes, Route } from 'react-router-dom';

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

  const Home = () => {
    return (
      <div>
        <EntryList />
        {user && <EntryForm />}
        <LoginForm />
        {user?.admin && (
          <div>
            <UserList />
          </div>
        )}
      </div>
    )
  }

  const user = useSelector(({ userData }) => {
    return userData.user;
  });
  return (
    <div className="container">
      <Notification />
      <Navigation />
      <h1>Excuse Me Soundboard (coming soon)</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<div>implement users</div>}/>
        <Route path="/entries" element={<div>implement entries</div>} />
      </Routes>
    </div>
  );
};

export default App;
