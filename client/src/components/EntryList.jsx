import ListEntry from "./ListEntry";
import { useSelector, useDispatch } from "react-redux";
import { updateEntryDatabase } from "../reducers/entryReducer";

const EntryList = () => {
  const entries = useSelector(({ entries }) => {
    return entries;
  });
  const dispatch = useDispatch();
  const handleLike = (entry) => {
    const stats = entry.stats
    const updatedEntry = { ...entry, stats: {
      ...stats,
      likes: stats?.likes ? stats.likes + 1 : 1,
    }}
    
    dispatch(updateEntryDatabase(updatedEntry))
  }
  const handleDownload = (entry) => {
    const stats = entry.stats
    const updatedEntry = { ...entry, stats: {
      ...stats,
      downloads: stats?.downloads ? stats.downloads + 1 : 1,
    }}
    
    dispatch(updateEntryDatabase(updatedEntry))
  }
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
              stats={x.stats}
              tags={x.tags}
              handleLike={() => handleLike(x)}
              handleDownload={() => handleDownload(x)}
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
