import { createContext } from "react";

export const NavBarContext = createContext({
  userInSession: false,
  setUserInSession: () => {},
});
