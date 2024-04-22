import React, { useState, useContext} from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

//INTERNAL IMPORT/
import { VotingContext } from "../../context/Voter";
import Style from "./NavBar.module.css";
import images from "../../images.png";

// Custom Image
import CustomImage from "../CustomImage";
const NavBar = () => {
  const { connectWallet, error, currentAccount } = useContext(VotingContext);
  const [openNav, setOpenNav] = useState(true);

  const openNaviagtion = () => {
    if (openNav) {
      setOpenNav(false);
    } else if (!openNav) {
      setOpenNav(true);
    }
  };
  const imagesRef = React.createRef();
  const imageStyle = {
    top: "6px !important",
  };
  return (
    <div className={Style.navbar}>
      {error === "" ? (
        ""
      ) : (
        <div className={Style.message__Box}>
          <div style={Style.message}>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className={Style.navbar_box}>
        <div className={Style.title}>
        <Link href={{ pathname: "/" }}>
          <CustomImage src={images} 
          ref={imagesRef}
          style={imageStyle}
          alt="logo" width={300} height={70} />
        </Link>
        </div>
        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={() => openNaviagtion()}>
                  {currentAccount.slice(0, 10)}..
                </button>
                {currentAccount && (
                  <span>
                    {openNav ? (
                      <AiFillUnlock onClick={() => openNaviagtion()} />
                    ) : (
                      <AiFillLock onClick={() => openNaviagtion()} />
                    )}
                  </span>
                )}
              </div>

              {openNav && (
                <div className={Style.navigation}>
                  <p>
                    <Link href={{ pathname: "/" }}>Home</Link>
                  </p>

                  <p>
                    <Link href={{ pathname: "candidate-regisration" }}>
                      Candidate Registraction
                    </Link>
                  </p>
                  <p>
                    <Link href={{ pathname: "allowed-voters" }}>
                      Voter Registraction
                    </Link>
                  </p>

                  <p>
                    <Link href={{ pathname: "voterList" }}>Voter Lsit</Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => connectWallet()}>Connect Wallet</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
