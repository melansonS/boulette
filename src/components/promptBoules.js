import React from "react";
import Boulette from "./boulette";
import "./promptBoules.css";

const PromptBoules = ({ prompts }) => {
  return (
    <div className="prompts">
      {prompts.map((prompt) => {
        return (
          <div key={prompt.id}>
            <Boulette className={prompt.drawn ? "drawn" : ""} />
          </div>
        );
      })}
    </div>
  );
};

export default PromptBoules;
