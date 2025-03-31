import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';

const DownloadCounter = () => {
  const users = useSelector(({ userData }) => {
    return userData.allUsers;
  });
  const currentUser = useSelector(({ userData }) => {
    return userData.user;
  });
  const user = users.find(x => x.username === currentUser.username)
  return (
    <div className="fixed-bottom">
      <Card body style={{ float: "right" }} bg='success'>Downloads used: {user.downloads}</Card>
    </div>
  )
}

export default DownloadCounter