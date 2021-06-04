import React from "react";
import Boulette from "./boulette";
import "./promptBoules.css";

const PromptBoules = ({ prompts }) => {
  if (prompts.length <= 0) {
    return <div className="prompts">Start adding prompts!</div>;
  }
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
