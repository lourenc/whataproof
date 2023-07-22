import { useState } from "react";
import { useSetAtom } from "jotai";
import { useAccount } from "wagmi";

import { watermarkApi } from "../api/watermark";
import { itemsAtom } from "../state/items";
import { api } from "../api/api";

export function CreateItemLink() {
  const account = useAccount();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [itemId, setItemId] = useState<string>("");
  const setItems = useSetAtom(itemsAtom);

  const onFileChange = (event: any) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("image", selectedFile, selectedFile.name);
    formData.append("key", "test");

    // Request made to the backend api
    // Send formData object

    watermarkApi
      .addWatermark(formData)
      .then((response) => {
        // Create a blob from the received binary data
        const watermarkedImageBlob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        const imageUrl = URL.createObjectURL(watermarkedImageBlob);

        const watermarkedImageElement = document.getElementById(
          "watermarked-image"
        ) as HTMLImageElement;
        watermarkedImageElement.src = imageUrl;

        setItemId("MOCKED-ITEM-ID");
        return api.createItem({
          meta: imageUrl,
          distributor: account.address!,
        });
      })
      .then((item) => {
        setItems((items) => [item, ...items]);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });

    // TODO - call backend to upload file, get watermarked bytes, encrypt and load to filecoin
    setItemId("MOCKED-ITEM-ID");
  };

  return (
    <div>
      <label>Load a file you want to distibute</label>
      <div>
        <label
          htmlFor="fileInput"
          className={`nes-btn ${selectedFile ? "is-primary" : ""}`}
        >
          Select File
          <input type="file" id="fileInput" onChange={onFileChange}></input>
        </label>
        <br />
        <p>{selectedFile ? selectedFile.name : "No file chosen"}</p>
      </div>
      {selectedFile && (
        <button className="nes-btn" onClick={onFileUpload}>
          Get link
        </button>
      )}
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
          <img id="watermarked-image" />
        </>
      )}
    </div>
  );
}
