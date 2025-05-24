import ListEntry from "./ListEntry";
import { useSelector } from "react-redux";

const Home = () => {
    const entries = useSelector(({ entries }) => {
      return entries;
    });
    const likedEntries = [...entries].sort((a, b) => {
      return (b.stats?.likes || 0) - (a.stats?.likes || 0);
    })
    const downloadedEntries = [...entries].sort((a, b) => {
      return (b.stats?.downloads || 0) - (a.stats?.downloads || 0);
    })
    return (
      <div>
        <p>Home stuff coming here</p>
        {entries.length !== 0 ? (
          <div>
          <h3>Top 3 Most Liked Entries</h3>
          {likedEntries.slice(0, 3).map((x) => (
            <ListEntry
            key={x.id}
            id={x.id}
            author={x.author}
            description={x.description}
            audio={x.audio}
            user={x.user}
            stats={x.stats}
            tags={x.tags}
            />
          ))}
          <h3>Top 3 Most Downloaded Entries</h3>
          {downloadedEntries.slice(0, 3).map((x) => (
            <ListEntry
            key={x.id}
            id={x.id}
            author={x.author}
            description={x.description}
            audio={x.audio}
            user={x.user}
            stats={x.stats}
            tags={x.tags}
            />
          ))}
          </div>
        ) : (
          <p>No entries found</p>
        )}
      </div>
    )
  }

export default Home;