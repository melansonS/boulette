import React, { useContext, useEffect, useState } from "react";
import { colors, URL } from "../utils/constants";
import { useParams, Link } from "react-router-dom";
import GameContext from "../contexts/gameContext";
import { socket } from "../utils/socket";
import Layout from "../components/layout";
import Button from "../components/button";
import TextInput from "../components/textInput";
import Boulette from "../components/boulette";
import Modal from "../components/modal";
import "./room.css";

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
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResetGameModal, setShowResetGameModal] = useState(false);

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
    setShowResetModal(false);
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
    setShowResetGameModal(false);
  };

  return (
    <Layout>
      {notfound && (
        <div className="not-found">
          Room not found, go back <br></br> <Link to="/">Home</Link>
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
                  <Button onClick={handleStopRound} label="Stop Round" />
                )}
              </>
            )}
            {!currentlyPlaying && roundInProgress && (
              <div>
                <span
                  style={{
                    color: playingUser.team === "redTeam" ? "red" : "blue",
                  }}>
                  [#]
                </span>
                {playingUser.username} is Currently playing c:
              </div>
            )}
            <div className="header">
              <h1>Boulette!</h1>
              <h4>Room Id: {roomId}</h4>
            </div>
            {teams && (
              <div className="teams">
                {teams.redTeam && (
                  <div className="team-container">
                    <h3>
                      <u>RedTeam:</u> {teams.redTeam.points}
                    </h3>
                    {teams.redTeam.members.map((member) => {
                      return (
                        <div>
                          <b style={{ color: "#C70039" }}>[#]</b>
                          <b>{member.username}</b>
                        </div>
                      );
                    })}
                    {myTeam !== "redTeam" && (
                      <Button
                        disabled={roundInProgress}
                        onClick={handleChangeTeam}
                        label="Join"
                      />
                    )}
                  </div>
                )}
                {teams.blueTeam && (
                  <div className="team-container">
                    <h3>
                      <u>BlueTeam:</u> {teams.blueTeam.points}
                    </h3>
                    {teams.blueTeam.members.map((member) => {
                      return (
                        <div>
                          <b style={{ color: "#1B87A8" }}>[#]</b>
                          <b>{member.username}</b>
                        </div>
                      );
                    })}
                    {myTeam !== "blueTeam" && (
                      <Button
                        disabled={roundInProgress}
                        onClick={handleChangeTeam}
                        label="Join"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="divider"></div>
            <Button
              className="start-round"
              disabled={roundInProgress}
              onClick={handleStartRound}
              label="Start Round!"
            />
            Add New Prompt!
            <form onSubmit={(e) => handlePromptSubmit(e)}>
              <TextInput
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder="cool prompt"
                disabled={roundInProgress}
                value={promptValue}
                type="submit"
              />
            </form>
            <h3>
              <u>Prompts</u>
            </h3>
            {prompts && (
              <div className="prompts">
                {prompts.map((prompt) => {
                  return (
                    <div key={prompt.id}>
                      <Boulette className={prompt.drawn ? "drawn" : ""} />
                      {/* <b
                      style={{
                        color: prompt.drawn ? "black" : `${colors.lightCyan}`,
                      }}>
                      {prompt.text}
                    </b>
                    <Button
                      onClick={() => handleDeletePrompt(prompt)}
                      label="x"
                    />

                    <Button
                      onClick={() => handleDrawPrompt(prompt)}
                      label="draw"
                    />
                    <Button
                      onClick={() => handleSkipPrompt(prompt)}
                      label="skip"
                    /> */}
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              onClick={() => setShowResetModal(true)}
              label="Reset Prompts"
            />
            {showResetModal && (
              <Modal closeModal={() => setShowResetModal(false)}>
                <h3>Are you sure you want to reset the prompts?</h3>
                <Button onClick={handleResetPrompts} label="Reset Prompts" />
              </Modal>
            )}
            <div>
              <h1>skipped prompts</h1>
              {skippedPrompts &&
                prompts.map((p) => {
                  if (skippedPrompts.includes(p.id))
                    return <div>Skiiped : {p.text}</div>;
                  else return null;
                })}
            </div>
            <Button
              onClick={() => setShowResetGameModal(true)}
              label="Reset Game"
            />
            {showResetGameModal && (
              <Modal closeModal={() => setShowResetGameModal(false)}>
                <h3>Are you sure you want to reset the Game?</h3>
                <Button
                  disabled={roundInProgress}
                  onClick={handleResetGame}
                  label="Reset Game"
                />
              </Modal>
            )}
            {users &&
              users.map((user) => {
                return (
                  <div>
                    <b style={{ color: "#00cc99" }}>[#]</b>
                    <b>{user.username}</b>
                  </div>
                );
              })}
          </>
        ) : (
          <div className="enter-your-name">
            Enter your name!{" "}
            <form onSubmit={(e) => handleSubmitName(e)}>
              <TextInput
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="cool name!"
              />
            </form>
          </div>
        ))}
    </Layout>
  );
};

export default Room;
