import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Navigation = () => {
  return (
    <Navbar className='bg-body-tertiary' sticky='top'>
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Navbar.Brand href="/">
            <img src='../lanturn.png' width={40} height={40}></img>
          </Navbar.Brand>
          <Nav className='me-auto'>
            <Nav.Link href="/" >Home </Nav.Link>
            <Nav.Link href="/users" >Users </Nav.Link>
            <Nav.Link href="/entries" >Entries </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation