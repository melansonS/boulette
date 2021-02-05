import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Welcome from "./components/welcome";
import Room from "./components/room";
import UserContext from "./contexts/userContext";

const Router = () => {
  const { name } = useContext(UserContext);
  return (
    <Switch>
      <Route exact path="/:roomId" component={Room} />
      <Route path="/" component={Welcome} />
      {/* <Redirect to="/" /> */}
    </Switch>
  );
};

export default Router;
