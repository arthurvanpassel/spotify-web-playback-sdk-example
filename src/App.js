import React, { useState, useEffect } from "react";
import WebPlayback from "./WebPlayback";
import Login from "./Login";
import "./App.css";

function App() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    async function getTokens() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setTokens([json.access_token_1, json.access_token_2]);
    }

    getTokens();
  }, []);

  if (tokens.includes("")) {
    return <Login />;
  }

  return <WebPlayback tokens={tokens} />;
}

export default App;
