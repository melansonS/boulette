import React, { useEffect } from "react";
import { socket } from "./utils/socket";
import Router from "./router";
import { GameProvider } from "./contexts/gameContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  useEffect(() => {
    const body = document.body;
    body.style.backgroundImage = "url(images/asfalt-dark.png)";
    return () => socket.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <GameProvider>
        <Router />
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
