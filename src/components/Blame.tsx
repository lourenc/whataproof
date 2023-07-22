import { useState } from "react";
import axios from 'axios';

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

    axios.post("http://127.0.0.1:5000/check_image", formData)
    .then(response => {
      const key = response.data;
      // \u0000\u0000\u0000\u0000 if no key found
      const watermarkElement = document.getElementById("watermark") as HTMLElement;
      watermarkElement.innerText = key;
    })
    .catch(error => {
      // Handle errors here
      console.error("Error:", error);
    });

    // axios.post("api/uploadfile", formData);
    // TODO - call backend to upload file, get watermarked bytes, encrypt and load to filecoin
    setLeaker("0x103FA68B461bdBDbc5456Fd3164f8A71fd25eb5f");
  };

  return (
    <div>
      <label>Load a file to detect a leaker</label>
      <div>
        <input onChange={onFileChange} type="file"></input>
        <br />
        <button onClick={onFileUpload}>Detect leaker</button>
      </div>
      <div>
        Watermark: <p id="watermark"></p>
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
