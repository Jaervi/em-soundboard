import { useSelector } from "react-redux";
import Alert from 'react-bootstrap/Alert';

const Notification = () => {
  const { notification, variant } = useSelector(({ notificationText }) => {
    return notificationText;
  });

  if (notification !== "") {
    console.log(notification);
    return (
      <Alert key={variant} variant={variant}>{notification}</Alert>
    );
  } else {
    return;
  }
};

export default Notification;
