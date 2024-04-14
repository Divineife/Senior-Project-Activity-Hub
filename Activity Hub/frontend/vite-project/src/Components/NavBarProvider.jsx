import { NavBarContext } from "./context";
import React, { useState, useEffect } from "react";

const NavBarProvider = ({ children }) => {
    const [userInSession, setUserInSession] = useState(false);
  
    const value = { userInSession, setUserInSession };
  
    return (
      <NavBarContext.Provider value={value}>
        {children}
      </NavBarContext.Provider>
    );
  };
  
  export default NavBarProvider;
  