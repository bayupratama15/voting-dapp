import React from "react";
import Image from "next/image";

import Style from "../card/card.module.css";
import image from "../../candidate.png";

const card = ({ candidateArray, giveVote }) => {
  // Remove duplicates from candidateArray
  const uniqueCandidateArray = Array.from(new Set(candidateArray.map(el => el[2].toNumber()))).map(id => {
    return candidateArray.find(el => el[2].toNumber() === id);
  });

  return (
    <div className={Style.card}>
      {uniqueCandidateArray.map((el, i) => (
        <div 
          key={i}
        className={Style.card_box}>
          <div className={Style.image}>
            <img src={el[3]} alt="Profile photo" />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[1]} #{el[2].toNumber()}
            </h2>
            <p>{el[0]}</p>
            <p>Address: {el[6].slice(0, 30)}..</p>
            <p className={Style.total}>Total Vote</p>
          </div>

          <div className={Style.card_vote}>
            <p>{el[4].toNumber()}</p>
          </div>

          <div className={Style.card_button}>
            <button
              onClick={() => giveVote({ id: el[2].toNumber(), address: el[6] })}
            >
              Give Vote
            </button>
          </div>
         </div>
      ))}
    </div>
  );
};

export default card;