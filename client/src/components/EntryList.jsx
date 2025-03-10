import ListEntry from "./ListEntry";
import { useSelector } from "react-redux";

const EntryList = () => {
  const entries = useSelector(({ entries }) => {
    return entries;
  });
  return (
    <div>
      {entries.length != 0 ? (
        <div>
          {entries.map((x) => (
            <ListEntry style={{padding: "0.20rem"}}
              key={x.id}
              id={x.id}
              author={x.author}
              description={x.description}
              audio={x.audio}
              user={x.user}
            />
          ))}
        </div>
      ) : (
        <p> No entries found </p>
      )}
    </div>
  );
};

export default EntryList;
