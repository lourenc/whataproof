import { useState } from "react";

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

    // Update the formData object
    formData.append("myFile", selectedFile, selectedFile.name);

    // Request made to the backend api
    // Send formData object

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
      {leaker && (
        <>
          <div>Leaker is:</div>
          <div>{leaker}</div>
        </>
      )}
    </div>
  );
}
