import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../contexts/userContext";
import { makeRoomId } from "../utils/roomId";
import { socket } from "../utils/socket";

const Welcome = () => {
  const { name, setName } = useContext(UserContext);
  const history = useHistory();

  const handleCreateRoom = () => {
    let roomId = makeRoomId();
    console.log("id!", roomId);
    socket.emit("createRoom", { roomId, name }, (response) => {
      console.log(response);
      roomId = response.id;
    });
    history.push(`/${roomId}`);
    // window.location.pathname = id;
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
      <button>Join Room</button>
      <button onClick={() => history.goBack()}> go back ? </button>
    </div>
  );
};

export default Welcome;
