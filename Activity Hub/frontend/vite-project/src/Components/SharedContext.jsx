import React, { createContext, useContext, useState } from 'react';

const SharedContext = createContext(null);

export const SharedProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  return (
    <SharedContext.Provider value={{ userData, setUserData}}>
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => useContext(SharedContext);
