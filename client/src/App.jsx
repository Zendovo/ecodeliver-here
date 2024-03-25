import { useContext, useState } from "react";
import Login from "./pages/Login";
import Canvas from "./pages/Canvas";
import GlobalContext from "./context/GlobalContext";

function App() {
  const { token } = useContext(GlobalContext);

  return <>{token ? <Canvas /> : <Login />}</>;
}

export default App;
