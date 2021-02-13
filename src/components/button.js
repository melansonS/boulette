import React from "react";
import "./button.css";

const Button = ({ onClick, label, type }) => {
  return (
    <button className="button" onClick={onClick} type={type}>
      {label}
    </button>
  );
};

export default Button;
