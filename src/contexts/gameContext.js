import React, { useState } from "react";

const GameContext = React.createContext();

const GameProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
  const [playingUser, setPlayingUser] = useState("");
  const [roundComplete, setRoundComplete] = useState(false);
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [timer, setTimer] = useState(undefined);
  const [myTeam, setMyTeam] = useState(undefined);
  const [teams, setTeams] = useState({});
  const [skippedPrompts, setSkippedPrompts] = useState([]);
  const value = {
    name,
    setName,
    currentlyPlaying,
    setCurrentlyPlaying,
    roundComplete,
    setRoundComplete,
    roundInProgress,
    setRoundInProgress,
    playingUser,
    setPlayingUser,
    timer,
    setTimer,
    myTeam,
    setMyTeam,
    teams,
    setTeams,
    skippedPrompts,
    setSkippedPrompts,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

const { Consumer } = GameContext;

export { Consumer as GameConsumer, GameProvider };

export default GameContext;
