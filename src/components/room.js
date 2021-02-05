import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { URL } from "../utils/constants";
import { useParams, Link } from "react-router-dom";
import UserContext from "../contexts/userContext";
import { socket } from "../utils/socket";

const Room = () => {
  const { name, setName } = useContext(UserContext);
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
      socket.emit("joinRoom", { roomId, name }, (response) => {
        console.log(response);
      });
    }
    socket.on("roomUsers", (data) => {
      console.log("users DATA", data);
      setUsers(data);
    });
    socket.on("allPrompts", (data) => {
      console.log("prompt DATA", data);
      setPrompts(data);
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

  return (
    <div>
      {notfound && (
        <div>
          Room not found, go back <Link to="/">Home</Link>
        </div>
      )}
      {!notfound &&
        (name ? (
          <>
            <p>This is the room! {roomId}</p>
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
