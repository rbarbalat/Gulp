import { createContext, useState } from 'react';

export const SearchContext = createContext();

export default function SearchProvider(props) {
  const [target, setTarget] = useState("");

  return (
    <SearchContext.Provider value={{ target, setTarget }}>
      {props.children}
    </SearchContext.Provider>
  )
}
