import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(({ notificationText }) => {
    return notificationText;
  });

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    color: "green",
  };
  if (notification !== "") {
    return <div style={style}>{notification}</div>;
  } else {
    return;
  }
};

export default Notification;
