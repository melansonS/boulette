import React from "react";
import "./button.css";

const Button = ({ onClick, label, type, className, disabled }) => {
  return (
    <button
      className={`button ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
