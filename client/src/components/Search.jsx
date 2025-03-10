import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'
import ListEntry from './ListEntry'
import { User } from './UserList'

const Search = () => {
  const id = window.sessionStorage.getItem("SearchKeyword");
  const [ keyword, setKeyword ] = useState('')
  
  const entries = useSelector(({ entries }) => {
    return entries;
  });

  const users = useSelector(({ userData }) => {
    return userData.allUsers;
  });

  const currentUser = useSelector(({ userData }) => {
    return userData.user;
  });

  const filteredEntries = 
    entries.filter(({ author, description }) => {
      const key = keyword.toLowerCase()
      return (author.toLowerCase().includes(key) || description.toLowerCase().includes(key))
    })

  const filteredUsers = 
    users.filter(({ username, name }) => {
      const key = keyword.toLowerCase()
      return (username.toLowerCase().includes(key) || name.toLowerCase().includes(key))
    })

  useEffect(() => {
    setKeyword(id ? id : '')
  }, [])

  return (
    <div>
      <Form className="d-flex py-3" color='dark'>
        <Form.Control
          type="search"
          placeholder="Search"
          className="bg-body-tertiary me-2"
          aria-label="Search"
          value={keyword}
          onChange={({ target }) => setKeyword(target.value)}
        />
      </Form>
      {filteredEntries.map((x) => (
        <ListEntry style={{padding: "0.20rem"}}
          key={x.id}
          id={x.id}
          author={x.author}
          description={x.description}
          audio={x.audio}
        />
      ))}
      {filteredUsers.map((user) => (
        <User
          key={user.id}
          user={user}
          currentUser={currentUser}
        />
      ))}
    </div>
  )
}

export default Search