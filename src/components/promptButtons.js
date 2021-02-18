import React, { useState } from "react";
import Button from "./button";

import "./promptButtons.css";

const PromptButtons = ({
  prompt,
  handleDeletePrompt,
  handleDrawPrompt,
  handleSkipPrompt,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="prompt-buttons">
      <Button onClick={() => handleDrawPrompt(prompt)} label="+1" />
      <Button onClick={() => handleSkipPrompt(prompt)} label="skip" />
      {confirmDelete ? (
        <Button
          className="red"
          onClick={() => handleDeletePrompt(prompt)}
          label="delete"
        />
      ) : (
        <Button onClick={() => setConfirmDelete(true)} label="delete" />
      )}
    </div>
  );
};

export default PromptButtons;
