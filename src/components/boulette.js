import react from "react";
import "./boulette.css";

const Boulette = ({ className }) => {
  return (
    <img
      className={`boulette ${className}`}
      src="images/crumpled-paper.png"></img>
  );
};

export default Boulette;
