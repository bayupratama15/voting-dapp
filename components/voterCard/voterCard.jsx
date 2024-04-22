import React from "react";
import Image from "next/image";

import Style from "../card/card.module.css";
import image from "../../candidate.png";
import voterCardStyle from "./voterCard.module.css";

const voterCard = ({ voterArray }) => {
  const uniqueVoterArray = Array.from(new Set(voterArray.map((el) => el[0].toNumber()))).map((id) => {
    return voterArray.find((el) => el[0].toNumber() === id);
  }
  );
  return (
    <div className={Style.card}>
      {uniqueVoterArray.map((el, i) => (
        <div key={i} className={Style.card_box}>
          <div className={Style.image}>
            <img src={el[4]} alt="Profile photo" />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[1]}
            </h2>
            <p>Address: {el[3].slice(0, 30)}..</p>
            <p>
              Voter ID: {typeof el[0] === "number" ? el[0].toNumber() : el[0].toString()}
            </p>
            <p className={voterCardStyle.vote_Status}>
              {el[6] == true ? "You Already Voted" : "Not Voted"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default voterCard;
