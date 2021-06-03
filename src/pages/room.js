import React, { useContext, useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { URL, colors } from "../utils/constants";
import { useParams, Link } from "react-router-dom";
import GameContext from "../contexts/gameContext";
import { socket } from "../utils/socket";
import Layout from "../components/layout";
import Button from "../components/button";
import TextInput from "../components/textInput";
import PromptBoules from "../components/promptBoules";
import Modal from "../components/modal";
import BouleAnim from "../components/bouleAnim";
import PromptButtons from "../components/promptButtons";
import shuffle from "../utils/shuffleArray";
import "./room.css";

const Room = () => {
  const {
    name,
    setName,
    roundInProgress,
    setRoundInProgress,
    roundComplete,
    setRoundComplete,
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
  const params = useParams();
  const roomId = params.roomId.toLowerCase();
  const [notfound, setNotFound] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResetGameModal, setShowResetGameModal] = useState(false);
  const [showTeamMembers, setShowTeamMembers] = useState(false);
  const [yourPrompt, setYourPrompt] = useState([]);
  const [animationFrame, setAnimationFrame] = useState(1);

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
      const amRed =
        data.redTeam.members.findIndex((member) => member.id === socket.id) !==
        -1;
      setMyTeam(amRed ? "redTeam" : "blueTeam");
    });
    socket.on("allPrompts", (data) => {
      const { prompts, roundCompleteReset } = data;
      if (roundCompleteReset) {
        setRoundComplete(true);
      }
      if (prompts && prompts.findIndex) {
        setPrompts(prompts);
        const shuffledPromts = shuffle(prompts);
        setYourPrompt(shuffledPromts[prompts.findIndex((p) => !p.drawn)]);
      }
    });
    socket.on("promptDrawn", (data) => {
      setTeams(data.teams);
      setPrompts(data.prompts);
      const available = data.prompts.filter((p) => !p.drawn);
      if (available.length === 0) {
        handleResetPrompts({ roundCompleteReset: true });
        return handleStopRound();
      }
      const index = Math.floor(Math.random() * available.length);
      setYourPrompt(available[index]);
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
    if (!prompts.find((p) => p.id !== prompt.id && !p.drawn)) {
      handleStopRound();
    }
  };

  const handleDrawPrompt = (prompt) => {
    socket.emit("drawPrompt", { roomId, promptId: prompt.id, team: myTeam });
  };

  const handleSkipPrompt = (prompt) => {
    setSkippedPrompts([...skippedPrompts, prompt.id]);
    const notDrawn = prompts.filter((p) => !p.drawn && p.id !== prompt.id);
    const available = notDrawn.filter(
      (p) => !skippedPrompts.find((skipped) => skipped.id === p.id)
    );
    console.log(available, prompts);
    if (available.length === 0) {
      if (notDrawn.length === 0) {
        return setYourPrompt(prompt);
      }
      setYourPrompt(notDrawn[0]);
    }
    const index = Math.floor(Math.random() * available.length);
    setYourPrompt(available[index]);
  };

  const handleResetPrompts = ({ roundCompleteReset }) => {
    socket.emit("resetPrompts", { roomId, roundCompleteReset });
    setShowResetModal(false);
  };

  const handleStartRound = () => {
    if (!yourPrompt) return;
    socket.emit("startRound", { roomId, name, team: myTeam });
  };
  const handleStopRound = () => {
    socket.emit("stopRound", { roomId });
    setSkippedPrompts([]);
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
      {!notfound &&
        (name ? (
          <>
            {roundComplete && (
              <Modal closeModal={() => setRoundComplete(false)}>
                <div style={{ textAlign: "center" }}>
                  <h3>Round Complete :D </h3>
                  <div>Get ready for the next round!</div>
                  <br></br>
                  <Button
                    onClick={() => setRoundComplete(false)}
                    label="Continue"
                  />
                </div>
              </Modal>
            )}
            {roundInProgress && !roundComplete && (
              <Modal canClose={false} closeModal={() => handleStopRound()}>
                <div> TIMER : {timer && Math.ceil(timer / 1000)}</div>
                {currentlyPlaying && yourPrompt && (
                  <>
                    <BouleAnim
                      key={yourPrompt.id}
                      text={yourPrompt.text}
                      animationFrame={animationFrame}
                      setAnimationFrame={setAnimationFrame}
                    />
                    <PromptButtons
                      key={`buttons-${yourPrompt.id}`}
                      prompt={yourPrompt}
                      disabled={animationFrame < 3}
                      handleDeletePrompt={handleDeletePrompt}
                      handleDrawPrompt={handleDrawPrompt}
                      handleSkipPrompt={handleSkipPrompt}
                    />
                    <Button onClick={handleStopRound} label="Stop Round" />
                    <PromptBoules prompts={prompts} />
                  </>
                )}
                {!currentlyPlaying && (
                  <div>
                    <span
                      style={{
                        color:
                          playingUser.team === "redTeam"
                            ? colors.red
                            : colors.blue,
                      }}>
                      [#]
                    </span>
                    {playingUser.username} is Currently playing c:
                  </div>
                )}
              </Modal>
            )}
            {!currentlyPlaying && roundInProgress && (
              <div>
                <span
                  style={{
                    color:
                      playingUser.team === "redTeam" ? colors.red : colors.blue,
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
                <Button
                  className="show-members"
                  onClick={() => setShowTeamMembers(!showTeamMembers)}
                  label={showTeamMembers ? <IoChevronDown /> : <IoChevronUp />}
                />
                {teams.redTeam && (
                  <div className="team-container">
                    <h3>
                      <u>RedTeam:</u> {teams.redTeam.points}
                    </h3>
                    <div
                      className={`team-members ${
                        showTeamMembers ? "hidden-team-members" : ""
                      }`}
                      style={{ "--height": teams.redTeam.members.length }}>
                      {teams.redTeam.members.map((member) => {
                        return (
                          <div key={member.id}>
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
                  </div>
                )}
                {teams.blueTeam && (
                  <div className="team-container">
                    <h3>
                      <u>BlueTeam:</u> {teams.blueTeam.points}
                    </h3>
                    <div
                      className={`team-members ${
                        showTeamMembers ? "hidden-team-members" : ""
                      }`}
                      style={{ "--height": teams.blueTeam.members.length }}>
                      {teams.blueTeam.members.map((member) => {
                        return (
                          <div key={member.id}>
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
                  </div>
                )}
              </div>
            )}
            <Button
              className="start-round"
              disabled={
                roundInProgress ||
                prompts.length < 3 ||
                !prompts.some((p) => !p.drawn)
              }
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
                required
                type="submit"
              />
            </form>
            <h3>
              <u>Prompts</u>
            </h3>
            {prompts && <PromptBoules prompts={prompts} />}
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
            <div className="reset-game">
              <Button
                onClick={() => setShowResetGameModal(true)}
                label="Reset Game"
              />
            </div>
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
