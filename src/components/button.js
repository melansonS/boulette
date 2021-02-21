import React from "react";
import { IoTrashOutline, IoCheckmarkSharp } from "react-icons/io5";

import "./button.css";

const Button = ({ onClick, label, type, className, disabled, icon }) => {
  return (
    <button
      className={`button ${className || ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}>
      {label}
      {icon === "delete" && <IoTrashOutline />}
      {icon === "success" && <IoCheckmarkSharp />}
    </button>
  );
};

export default Button;
