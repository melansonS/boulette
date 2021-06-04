// import react from "react";
import "./boulette.css";

const Boulette = ({ className }) => {
  return (
    <img
      className={`boulette ${className}`}
      src="images/crumpled-paper.png"
      alt={`${className} boulette`}></img>
  );
};

export default Boulette;
