import React from "react";
import { IoTrashOutline } from "react-icons/io5";

import "./button.css";

const Button = ({ onClick, label, type, className, disabled }) => {
  return (
    <button
      className={`button ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}>
      {label === "delete" ? <IoTrashOutline /> : label}
    </button>
  );
};

export default Button;
