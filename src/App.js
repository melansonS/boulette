import React, { useState, useEffect, useContext } from "react";
import { socket } from "./utils/socket";
import Router from "./router";
import { UserProvider, UserConsumer } from "./contexts/userContext";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    socket.on("FromAPI", (data) => {
      setResponse(data);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
        <Router />
        <p>it's {response}</p>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
