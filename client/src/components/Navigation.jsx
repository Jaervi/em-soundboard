import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from "../reducers/userReducer";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navigation = () => {
  const user = useSelector(({ userData }) => {
    return userData.user;
  });

  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logoutUser());
    navigate('/');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    window.sessionStorage.setItem("SearchKeyword", search);
    navigate(`/search`);
  }

  return (
    <Navbar className='bg-body-tertiary' sticky='top' expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">
          <img src='../lanturn.png' width={40} height={40}></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link href="/" >Home </Nav.Link>
            <Nav.Link href="/users" >Users </Nav.Link>
            <Nav.Link href="/entries" >Entries </Nav.Link>
          </Nav>
          {user ?
            <div>
              <Navbar.Text className='pe-2'>
                Logged in with {user.username} ({user.name})
              </Navbar.Text>
              <Button variant='info' onClick={handleLogout}>Log out</Button>
            </div>
            :
            <Nav>
              <Nav.Link href="/" >Login </Nav.Link>
            </Nav>
          }
          <Form className="d-flex ps-3">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            />
            <Button variant="outline-success" onClick={handleSearch}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation