import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Welcome from "./components/welcome";
import Room from "./components/room";
import GameContext from "./contexts/gameContext";

const Router = () => {
  const { name } = useContext(GameContext);
  return (
    <Switch>
      <Route exact path="/:roomId" component={Room} />
      <Route path="/" component={Welcome} />
      {/* <Redirect to="/" /> */}
    </Switch>
  );
};

export default Router;
