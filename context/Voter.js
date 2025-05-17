import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";

//INTERNAL IMPORT
import { VotingAddress, VotingAddressABI } from "./constants";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  // =========================================================
  //---ERROR Message
  const [error, setError] = useState("");
  const higestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);
  ///CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
      console.log("Connected 1", account[0]);
      getAllVoterData();
      getNewCandidate();
    } else {
      setError("Please Install MetaMask & Connect, Reload");
    }
  };

  // check network http://84.46.241.50:9655/

  useEffect(() => {
    checkIfWalletIsConnected();
    const { ethereum } = window;

    if (ethereum) {
      ethereum.on("accountsChanged", (accounts) => {
        setCurrentAccount(accounts[0]);
        console.log("Connected 3", accounts[0]);
        getAllVoterData();
      });
    }
  }, []);

  // ===========================================================
  //CONNECT WELATE
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    console.log("Connected 2", accounts[0]);
    getAllVoterData();
    // getNewCandidate();
  };
  // ================================================

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `48eebbe2e201f489a505`,
            pinata_secret_api_key: `
            d2260dd3c16ec1e7b87d9346c082b4dbd39098d49b70e5bce7c15573a9c8bcf9`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        return ImgHash;
      } catch (error) {
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  const uploadToIPFSCandidate = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `48eebbe2e201f489a505`,
            pinata_secret_api_key: `
            d2260dd3c16ec1e7b87d9346c082b4dbd39098d49b70e5bce7c15573a9c8bcf9`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        return ImgHash;
      } catch (error) {
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  // =============================================
  //CREATE VOTER----------------------
  const createVoter = async (formInput, fileUrl) => {
    try {
      const { name, address, position } = formInput;

      if (!name || !address || !position)
        return console.log("Input Data is missing");

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, position, image: fileUrl });

      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `48eebbe2e201f489a505`,
          pinata_secret_api_key: `
        d2260dd3c16ec1e7b87d9346c082b4dbd39098d49b70e5bce7c15573a9c8bcf9`,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

      const voter = await contract.voterRight(address, name, url, fileUrl);
      voter.wait();

      router.push("/voterList");
    } catch (error) {
      console.log(error);
    }
  };
  // =============================================

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //VOTR LIST
      const voterListData = await contract.getVoterList();
      console.log("voterListData", voterListData);
      setVoterAddress(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        // ADD UNIQUE VOTER DATA TO ARRAY
        pushVoter.push(singleVoterData);
      });

      //VOTER LENGHT
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber());

      // SET VOTER ARRAY
      setVoterArray(pushVoter);
    } catch (error) {
      console.log("All data");
    }
  };

  // =============================================

  // =============================================
  ////////GIVE VOTE

  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voteredList = await contract.vote(voterAddress, voterId);
      console.log(voteredList);
    } catch (error) {
      setError("Sorry!, You have already voted, Reload Browser");
    }
  };
  // =============================================

  const setCandidate = async (candidateForm, fileUrl, router) => {
    const { name, address, age } = candidateForm;

    if (!name || !address || !age) return console.log("Input Data is missing");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = JSON.stringify({
      name,
      address,
      image: fileUrl,
      age,
    });

    const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
        pinata_api_key: `48eebbe2e201f489a505`,
        pinata_secret_api_key: `
      d2260dd3c16ec1e7b87d9346c082b4dbd39098d49b70e5bce7c15573a9c8bcf9`,
        "Content-Type": "application/json",
      },
    });

    const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

    const candidate = await contract.setCandidate(
      address,
      age,
      name,
      fileUrl,
      url
    );
    candidate.wait();

    router.push("/");
  };

  const getNewCandidate = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    //---------ALL CANDIDATE
    const allCandidate = await contract.getCandidate();
    if (!allCandidate)
      return setError("No Candidate Found, Please Add Candidate");
    
    console.log("allCandidate", allCandidate);

    //--------CANDIDATE DATA
    allCandidate.map(async (el) => {
      const singleCandidateData = await contract.getCandidateData(el);
      console.log("singleCandidateData", singleCandidateData);

      pushCandidate.push(singleCandidateData);
      candidateIndex.push(singleCandidateData[2].toNumber());
    });
    console.log("candidateIndex", candidateIndex);
    console.log("pushCandidate", pushCandidate);

    //---------CANDIDATE LENGTH
    const allCandidateLength = await contract.getCandidateLength();
    console.log("allCandidateLength", allCandidateLength);
    setCandidateLength(allCandidateLength.toNumber());
  };

  return (
    <VotingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        uploadToIPFS,
        createVoter,
        setCandidate,
        getNewCandidate,
        giveVote,
        pushCandidate,
        candidateArray,
        uploadToIPFSCandidate,
        getAllVoterData,
        voterArray,
        giveVote,
        checkIfWalletIsConnected,
        error,
        candidateLength,
        voterLength,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
