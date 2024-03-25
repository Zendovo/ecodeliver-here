import React, { useState } from "react";
import GlobalContext from "./GlobalContext";

export default function ContextWrapper(props) {
  const [token, setToken] = useState("");

  return (
    <GlobalContext.Provider value={{ token, setToken }}>
      {props.children}
    </GlobalContext.Provider>
  );
}
