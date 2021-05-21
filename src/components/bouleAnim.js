import React, { useEffect, useState } from "react";
import "./bouleAnim.css";

const BouleAnim = ({ text, animationFrame, setAnimationFrame }) => {
  const [rotation, setRotation] = useState(Math.ceil(Math.random() * 12));
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (animationFrame < 3) {
        let random = Math.ceil(Math.random() * 12);
        random = random % 2 === 0 ? random : random * -1;
        setRotation(random);
        setAnimationFrame(animationFrame + 1);
      } else {
        clearInterval(myInterval);
      }
    }, 850);
    return () => {
      clearInterval(myInterval);
    };
  });
  useEffect(() => {
    return setAnimationFrame(1);
  }, [setAnimationFrame]);

  return (
    <div className="container" style={{ "--rotate": `${rotation}deg` }}>
      {animationFrame === 3 && <p className="text">{text}</p>}
      <img
        alt="unwrapped ball of paper"
        className="image"
        src={`images/boulette${animationFrame}.png` || ""}></img>
    </div>
  );
};

export default BouleAnim;
