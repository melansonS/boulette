import React, { useState } from "react";
import Button from "./button";

import "./promptButtons.css";

const PromptButtons = ({
  disabled,
  prompt,
  handleDeletePrompt,
  handleDrawPrompt,
  handleSkipPrompt,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="prompt-buttons">
      <Button
        onClick={() => handleDrawPrompt(prompt)}
        icon="success"
        disabled={disabled}
      />
      <Button
        onClick={() => handleSkipPrompt(prompt)}
        label="skip"
        disabled={disabled}
      />
      {confirmDelete ? (
        <Button
          className="red"
          onClick={() => handleDeletePrompt(prompt)}
          label="delete"
        />
      ) : (
        <Button
          onClick={() => setConfirmDelete(true)}
          icon="delete"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default PromptButtons;
