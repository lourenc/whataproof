import { useState } from "react";

export function CreateItemLink() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [itemId, setItemId] = useState<string>("");

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
    setItemId("MOCKED-ITEM-ID");
  };

  return (
    <div>
      <label>Load file you want to distibute</label>
      <div>
        <input onChange={onFileChange} type="file"></input>
      </div>
      {selectedFile && <button onClick={onFileUpload}>Get link</button>}
      {itemId && (
        <>
          <div>Your item is ready to be distributed!</div>
          <div>Item id: {itemId}</div>
          <div>
            Link:{" "}
            <a href={`https://${window.location.host}/item/${itemId}`}>
              https://{window.location.host}/item/{itemId}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
