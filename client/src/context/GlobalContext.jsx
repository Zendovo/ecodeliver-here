import React from "react";

const GlobalContext = React.createContext({
  token: "",
  setToken: () => {},
  polyline: "",
  setPolyline: () => {},
  sourceCoords: null,
  setSourceCoords: () => {},
  destCoords: null,
  setDestCoords: () => {},
});

export default GlobalContext;
