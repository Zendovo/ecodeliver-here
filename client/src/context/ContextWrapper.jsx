import React, { useState } from "react";
import GlobalContext from "./GlobalContext";

export default function ContextWrapper(props) {
  const [token, setToken] = useState("");
  const [polyline, setPolyline] = useState("");
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        token,
        setToken,
        polyline,
        setPolyline,
        sourceCoords,
        setSourceCoords,
        destCoords,
        setDestCoords,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
