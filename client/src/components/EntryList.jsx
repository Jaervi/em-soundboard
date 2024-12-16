import ListEntry from "./ListEntry";
import { useSelector } from "react-redux";

const EntryList = () => {
  const entries = useSelector(({ entries }) => {
    return entries;
  });

    return (
      <div>
        {entries.map(x => (<ListEntry key = {x.id} author = {x.author} description={x.description}/>))}
      </div>
    );
  }

export default EntryList;
