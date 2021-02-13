import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import GameContext from "../contexts/gameContext";
import { makeRoomId } from "../utils/roomId";
import { socket } from "../utils/socket";
import Layout from "../components/layout";
import Button from "../components/button";
import TextInput from "../components/textInput";

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
    <Layout>
      <h1>Welcome! {name}</h1>
      <TextInput
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a username!"
        value={name}
      />
      <Button onClick={handleCreateRoom} label="Create Room" />
      <form onSubmit={(e) => handleJoinRoom(e)}>
        <TextInput
          onChange={(e) => setRoomdId(e.target.value)}
          placeholder="Enter room id"
          required
        />
        <Button type="submit" label="Join Room" />
      </form>
    </Layout>
  );
};

export default Welcome;
