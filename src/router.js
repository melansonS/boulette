import React from "react";
import { Switch, Route } from "react-router-dom";

import Welcome from "./components/welcome";
import Room from "./components/room";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/:roomId" component={Room} />
      <Route path="/" component={Welcome} />
    </Switch>
  );
};

export default Router;
