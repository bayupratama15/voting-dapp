import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

//INTRNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const candidateRegisration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const {
    uploadToIPFSCandidate,
    setCandidate,
    getNewCandidate,
    candidateArray,
  } = useContext(VotingContext);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();

  //-------------VOTERS
  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFSCandidate(acceptedFile[0]);
    console.log(url);
    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    // getNewCandidate();
  }, []);
  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="asset_file" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbsp;{candidateForm.name}</span>
              </p>
              <p>
                Add:&nbsp; <span>{candidateForm.address.slice(0, 20)} </span>
              </p>
              <p>
                age:&nbsp;<span>{candidateForm.age}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate For Voting</h4>
              <p>
                Blockchain voting orgainzation, privide ethereum blockchain eco
                system
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Register New Candidate</h1>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={Style.voter__container__box__div_info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM MAX 100MB</p>

                  <div className={Style.voter__container__box__div__image}>
                    <Image
                      src={images.upload}
                      width={150}
                      height={150}
                      objectFit="contain"
                      alt="file upload"
                    />
                  </div>

                  <p>Drag & Drop File</p>
                  <p>or Browse media on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input
            inputType="text"
            title="Cadidate Name"
            placeholder="Cadidate Name"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Cadidate Address"
            placeholder="Cadidate Address"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Cadidate Age"
            placeholder="Cadidate Age"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, age: e.target.value })
            }
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorized Candidate"
              handleClick={() => setCandidate(candidateForm, fileUrl, router)}
            />
          </div>
        </div>
      </div>

      <div className={Style.createdVorter}>
        <div className={Style.createdVorter__info}>
          <Image src={images.creator} alt="user profile" />
          <p>Notice</p>
          <p>
            Organizer <span>0xf39Fd6e51..</span>
          </p>
          <p>
            Only organizer of the voting contract can create voter and candidate
            for voting election
          </p>
        </div>
      </div>
    </div>
  );
};

export default candidateRegisration;
