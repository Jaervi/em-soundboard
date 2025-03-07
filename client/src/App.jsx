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
        <LoginForm />
        {user && <p>Home stuff coming here</p>}
      </div>
    )
  }

  const Entries = () => {
    return (
      <div>
        <EntryList />
        <EntryForm />
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
        <Route path="/users" element={<UserList />}/>
        <Route path="/entries" element={user && <Entries/>} />
      </Routes>
    </div>
  );
};

export default App;
