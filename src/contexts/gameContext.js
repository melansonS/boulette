import React, { useState } from "react";

const GameContext = React.createContext();

const GameProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
  const [playingUser, setPlayingUser] = useState("");
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [timer, setTimer] = useState(undefined);
  const value = {
    name,
    setName,
    currentlyPlaying,
    setCurrentlyPlaying,
    roundInProgress,
    setRoundInProgress,
    playingUser,
    setPlayingUser,
    timer,
    setTimer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

const { Consumer } = GameContext;

export { Consumer as GameConsumer, GameProvider };

export default GameContext;
