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
  } = useContext(GameContext);
  const { roomId } = useParams();
  const [notfound, setNotFound] = useState(false);
  const [users, setUsers] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [promptValue, setPromptValue] = useState("");
  useEffect(async () => {
    const response = await fetch(`${URL}/check-rooms?id=${roomId}`);
    const body = await response.json();
    setNotFound(body.notFound);
    console.log({ body });
  }, []);
  useEffect(() => {
    if (name) {
      socket.emit("joinRoom", { roomId, name });
    }
    socket.on("roomUsers", (data) => {
      console.log("users DATA", data);
      setUsers(data);
    });
    socket.on("allPrompts", (data) => {
      console.log("prompt DATA", data);
      setPrompts(data);
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
      setPlayingUser(false);
      console.log("set current to fasle!");
      setCurrentlyPlaying(false);
      setPlayingUser("");
    });
    socket.on("roomTimer", (data) => {
      console.log("is tiemr ? ");
      setTimer(data);
    });
    socket.on("stopTimer", () => {
      setTimer(undefined);
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

  const handleStartRound = () => {
    socket.emit("startRound", { roomId, name });
  };
  const handleStopRound = () => {
    socket.emit("stopRound", { roomId });
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
              <div>{playingUser} is Currently playing c:</div>
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
                value={promptValue}
              ></input>
            </form>
            {prompts &&
              prompts.map((prompt) => {
                return (
                  <div key={prompt.id}>
                    <b>{prompt.text}</b>
                    <button
                      onClick={() =>
                        socket.emit("deletePrompt", {
                          roomId,
                          promptId: prompt.id,
                        })
                      }
                    >
                      x
                    </button>
                  </div>
                );
              })}
            {users &&
              users.map((user) => {
                return (
                  <div>
                    <b style={{ color: "#00cc99" }}>[#]</b>
                    <b>{user.username}</b>
                  </div>
                );
              })}
            <div>{JSON.stringify(users)}</div>
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
