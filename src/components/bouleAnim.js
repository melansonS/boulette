import React, { useEffect, useState } from "react";
import "./bouleAnim.css";

const BouleAnim = ({ text }) => {
  const [frame, setFrame] = useState(1);
  const [rotation, setRotation] = useState(Math.ceil(Math.random() * 15));

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (frame < 3) {
        let random = Math.ceil(Math.random() * 15);
        random = random % 2 === 0 ? random : random * -1;
        setRotation(random);
        console.log({ random });
        setFrame(frame + 1);
      } else {
        clearInterval(myInterval);
      }
    }, 800);
    return () => clearInterval(myInterval);
  });

  return (
    <div className="container" style={{ "--rotate": `${rotation}deg` }}>
      {frame === 3 && <p className="text">{text}</p>}
      <img className="image" src={`images/boulette${frame}.png` || ""}></img>
    </div>
  );
};

export default BouleAnim;
