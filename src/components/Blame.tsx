import { useState } from "react";
import axios from "axios";
import "nes.css/css/nes.min.css";
import { watermarkApi } from "../api/watermark";

export function Blame() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [leaker, setLeaker] = useState<string>("");

  const onFileChange = (event: any) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    formData.append("image", selectedFile, selectedFile.name);

    watermarkApi
      .checkWatermark(formData)
      .then((response) => {
        const key = response.data;
        // \u0000\u0000\u0000\u0000 if no key found
        setLeaker(key);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <label>Load a file to detect a leaker</label>
      <div>
        <label
          htmlFor="fileInputBlame"
          className={`nes-btn ${selectedFile ? "is-primary" : ""}`}
        >
          Select File
          <input
            type="file"
            id="fileInputBlame"
            onChange={onFileChange}
          ></input>
        </label>
        <br />
        <p>{selectedFile ? selectedFile.name : "No file chosen"}</p>
        <button className="nes-btn" onClick={onFileUpload}>
          Detect leaker
        </button>
      </div>
      {leaker && (
        <>
          <div>Leaker is:</div>
          <div>{leaker}</div>
        </>
      )}
    </div>
  );
}
