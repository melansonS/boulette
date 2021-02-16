import React from "react";
import Button from "./button";
import "./promptButtons.css";

const PromptButtons = ({
  prompt,
  handleDeletePrompt,
  handleDrawPrompt,
  handleSkipPrompt,
}) => {
  return (
    <div className="prompt-buttons">
      <Button onClick={() => handleDrawPrompt(prompt)} label="draw" />
      <Button onClick={() => handleSkipPrompt(prompt)} label="skip" />
      <Button onClick={() => handleDeletePrompt(prompt)} label="delete" />
    </div>
  );
};

export default PromptButtons;
