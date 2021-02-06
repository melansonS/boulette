import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import GameContext from "../contexts/gameContext";
import { makeRoomId } from "../utils/roomId";
import { socket } from "../utils/socket";

const Welcome = () => {
  const { name, setName } = useContext(GameContext);
  const [roomId, setRoomdId] = useState("");
  const history = useHistory();

  const handleCreateRoom = () => {
    let newRoomId = makeRoomId();
    console.log("id!", newRoomId);
    socket.emit("createRoom", { roomId: newRoomId }, (response) => {
      console.log(response);
      newRoomId = response.id;
    });
    history.push(`/${newRoomId}`);
    // window.location.pathname = id;
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    console.log(roomId);
    history.push(`/${roomId}`);
  };

  return (
    <div>
      <h1>Welcome! {name}</h1>
      <input
        type="text"
        placeholder="Enter a username!"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <button onClick={handleCreateRoom}>Create Room</button>
      <form onSubmit={(e) => handleJoinRoom(e)}>
        <input
          type="text"
          name="room-name"
          onChange={(e) => setRoomdId(e.target.value)}
          placeholder="Enter room id"
          required
        ></input>
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default Welcome;
