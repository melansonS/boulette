import React, { useState } from "react";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [name, setName] = useState("");
  const value = { name, setName };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const { Consumer } = UserContext;

export { Consumer as UserConsumer, UserProvider };

export default UserContext;
