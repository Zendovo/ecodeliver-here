import React from "react";

const GlobalContext = React.createContext({
  token: "",
  setToken: () => {},
});

export default GlobalContext;
