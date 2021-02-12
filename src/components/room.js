import React, { useContext, useEffect, useState } from "react";
import { URL } from "../utils/constants";
import { useParams, Link } from "react-router-dom";
import GameContext from "../contexts/gameContext";
import { socket } from "../utils/socket";

const Room = () => {
  const {
    name,
    setName,
    roundInProgress,
    setRoundInProgress,
    playingUser,
    setPlayingUser,
    currentlyPlaying,
    setCurrentlyPlaying,
    timer,
    setTimer,
    myTeam,
    setMyTeam,
    teams,
    setTeams,
    skippedPrompts,
    setSkippedPrompts,
  } = useContext(GameContext);
  const { roomId } = useParams();
  const [notfound, setNotFound] = useState(false);
  const [users, setUsers] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [promptValue, setPromptValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${URL}/check-rooms?id=${roomId}`);
      const body = await response.json();
      setNotFound(body.notFound);
    };
    fetchData();
  }, [roomId]);
  useEffect(() => {
    if (name && !notfound) {
      socket.emit("joinRoom", { roomId, name });
    }
    socket.on("notFound", () => {
      setNotFound(true);
    });
    socket.on("roomUsers", (data) => {
      console.log("users DATA", data);
      setTeams(data);
      setUsers([...data.redTeam.members, ...data.blueTeam.members]);
      const amRed =
        data.redTeam.members.findIndex((member) => member.id === socket.id) !==
        -1;
      setMyTeam(amRed ? "redTeam" : "blueTeam");
    });
    socket.on("allPrompts", (data) => {
      console.log("prompt DATA", data);
      setPrompts(data);
    });
    socket.on("promptDrawn", (data) => {
      setTeams(data.teams);
      setPrompts(data.prompts);
    });
    socket.on("roundStart", (data) => {
      console.log("ROUND START?? data", data);
      setRoundInProgress(true);
      setPlayingUser(data);
    });
    socket.on("currentlyPlaying", () => {
      console.log("am currently playing ?");
      setCurrentlyPlaying(true);
    });
    socket.on("roundStop", () => {
      console.log("STOPPING ROUND!", { currentlyPlaying });
      setRoundInProgress(false);
      console.log("set current to fasle!");
      setCurrentlyPlaying(false);
      setPlayingUser("");
    });
    socket.on("roomTimer", (data) => {
      setTimer(data);
    });
    socket.on("stopTimer", () => {
      setTimer(undefined);
    });
    socket.on("gameReset", (data) => {
      setTeams(data.teams);
      setPrompts(data.prompts);
    });
    return () => socket.emit("leaveRoom", { roomId });
  }, []);

  const handleSubmitName = (e) => {
    e.preventDefault();
    setName(nameValue);
    socket.emit("joinRoom", { roomId, name: nameValue });
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    socket.emit("addPrompt", { roomId, prompt: promptValue });
    setPromptValue("");
  };

  const handleDeletePrompt = (prompt) => {
    socket.emit("deletePrompt", { roomId, promptId: prompt.id });
  };
  const handleDrawPrompt = (prompt) => {
    socket.emit("drawPrompt", { roomId, promptId: prompt.id, team: myTeam });
  };
  const handleSkipPrompt = (prompt) => {
    setSkippedPrompts([...skippedPrompts, prompt.id]);
  };

  const handleResetPrompts = () => {
    socket.emit("resetPrompts", { roomId });
  };

  const handleStartRound = () => {
    socket.emit("startRound", { roomId, name, team: myTeam });
  };
  const handleStopRound = () => {
    socket.emit("stopRound", { roomId });
  };

  const handleChangeTeam = () => {
    socket.emit("changeTeam", { roomId, team: myTeam });
  };

  const handleResetGame = () => {
    socket.emit("resetGame", { roomId });
  };

  return (
    <div>
      {notfound && (
        <div>
          Room not found, go back <Link to="/">Home</Link>
        </div>
      )}
      {timer && <div> TIMER : {timer}</div>}
      {!notfound &&
        (name ? (
          <>
            {currentlyPlaying && (
              <>
                <div>YOU ARE CURRENTLY PLAYING! </div>
                {roundInProgress && (
                  <button onClick={handleStopRound}>Stop Round!!</button>
                )}
              </>
            )}
            {!currentlyPlaying && roundInProgress && (
              <div>
                <span
                  style={{
                    color: playingUser.team === "redTeam" ? "red" : "blue",
                  }}
                >
                  [#]
                </span>
                {playingUser.username} is Currently playing c:
              </div>
            )}
            <p>This is the room! {roomId}</p>
            {!roundInProgress && (
              <button onClick={handleStartRound}>Start Round!!</button>
            )}
            Add New Prompt!
            <form onSubmit={(e) => handlePromptSubmit(e)}>
              <input
                type="text"
                placeholder="cool prompt"
                onChange={(e) => setPromptValue(e.target.value)}
                required
                value={promptValue}
                disabled={roundInProgress}
              ></input>
            </form>
            <h4>Prompts</h4>
            {prompts &&
              prompts.map((prompt) => {
                return (
                  <div key={prompt.id}>
                    <b style={{ color: prompt.drawn ? "#eee" : "black" }}>
                      {prompt.text}
                    </b>
                    <button onClick={() => handleDeletePrompt(prompt)}>
                      x
                    </button>
                    <button onClick={() => handleDrawPrompt(prompt)}>
                      draw
                    </button>
                    <button onClick={() => handleSkipPrompt(prompt)}>
                      skip
                    </button>
                  </div>
                );
              })}
            <button onClick={handleResetPrompts}> Reset Prompts</button>
            {users &&
              users.map((user) => {
                return (
                  <div>
                    <b style={{ color: "#00cc99" }}>[#]</b>
                    <b>{user.username}</b>
                  </div>
                );
              })}
            {teams && (
              <div>
                {teams.redTeam && (
                  <div>
                    <h4>RedTeam Score: {teams.redTeam.points}</h4>
                    {myTeam !== "redTeam" && (
                      <button
                        disabled={roundInProgress}
                        onClick={handleChangeTeam}
                      >
                        Join Red Team
                      </button>
                    )}
                    {teams.redTeam.members.map((member) => {
                      return (
                        <div>
                          <b style={{ color: "#C70039" }}>[#]</b>
                          <b>{member.username}</b>
                        </div>
                      );
                    })}
                  </div>
                )}
                {teams.blueTeam && (
                  <div>
                    <h4>BlueTeam Score: {teams.blueTeam.points}</h4>
                    {myTeam !== "blueTeam" && (
                      <button
                        disabled={roundInProgress}
                        onClick={handleChangeTeam}
                      >
                        Join Blue Team
                      </button>
                    )}
                    {teams.blueTeam.members.map((member) => {
                      return (
                        <div>
                          <b style={{ color: "#1B87A8" }}>[#]</b>
                          <b>{member.username}</b>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <div>{JSON.stringify(users)}</div>
            <div>
              <h1>skipped prompts</h1>
              {skippedPrompts &&
                prompts.map((p) => {
                  if (skippedPrompts.includes(p.id))
                    return <div>Skiiped : {p.text}</div>;
                  else return null;
                })}
            </div>
            <button onClick={handleResetGame}>Reset Game</button>
          </>
        ) : (
          <div>
            Enter your name!{" "}
            <form onSubmit={(e) => handleSubmitName(e)}>
              <input
                type="text"
                placeholder="cool name"
                onChange={(e) => setNameValue(e.target.value)}
              ></input>
            </form>
          </div>
        ))}
    </div>
  );
};

export default Room;
