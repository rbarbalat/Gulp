import { createContext, useState } from 'react';

export const SearchContext = createContext();

export default function SearchProvider(props) {
  const [targetName, setTargetName] = useState("");
  const [targetTags, setTargetTags] = useState("");

  const value = { targetName, setTargetName, targetTags, setTargetTags };

  return (
    <SearchContext.Provider value={value}>
      {props.children}
    </SearchContext.Provider>
  )
}
