import { createContext, useState } from 'react';

export const SearchContext = createContext();

export default function SearchProvider(props) {
  const [targetName, setTargetName] = useState("");
  const [targetTags, setTargetTags] = useState("");

  return (
    <SearchContext.Provider value={{ targetName, setTargetName, targetTags, setTargetTags }}>
      {props.children}
    </SearchContext.Provider>
  )
}
