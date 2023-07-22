import { useState } from "react";
import { useSetAtom } from "jotai";
import { useAccount, useChainId } from "wagmi";

import { itemsAtom } from "../state/items";
import { api } from "../api/api";

import { encryptFileWithEOAAccess } from "../lit-sdk";
import { useEthersSigner } from "../hooks/useEthersSigner";

export function CreateItemLink() {
  const account = useAccount();
  const chainId = useChainId();
  const ethersSigner = useEthersSigner({ chainId });

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [itemId, setItemId] = useState<string>("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const setItems = useSetAtom(itemsAtom);

  const onFileChange = (event: any) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = async () => {
    if (!ethersSigner || !account.address) {
      return;
    }

    // // Create an object of formData
    // const formData = new FormData();

    // formData.append("image", selectedFile, selectedFile.name);
    // formData.append("key", "test");

    // const watermarkedImageResponse = await watermarkApi.addWatermark(formData);
    // const watermarkedImageBlob = new Blob([watermarkedImageResponse.data], {
    //   type: watermarkedImageResponse.headers["content-type"],
    // });

    // console.log("here is watermark", watermarkedImageBlob);

    setImageBlob(selectedFile);

    const cidString = await encryptFileWithEOAAccess(
      chainId,
      ethersSigner.provider as any,
      account.address.toLowerCase(),
      account.address.toLowerCase(),
      selectedFile
    );

    if (!cidString) {
      throw new Error("Failed to save encrypted to LIT");
    }

    const savedItem = await api.createItem({
      meta: cidString,
      distributor: account.address,
    });

    setItemId(savedItem.id);
    setItems((items) => [savedItem, ...items]);
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
      {itemId && imageBlob && (
        <>
          <div>Your item is ready to be distributed!</div>
          <div>Item id: {itemId}</div>
          <div>
            Link:{" "}
            <a href={`https://${window.location.host}/item/${itemId}`}>
              https://{window.location.host}/item/{itemId}
            </a>
          </div>
          <img
            id="watermarked-image"
            width="100%"
            src={URL.createObjectURL(imageBlob)}
          />
        </>
      )}
    </div>
  );
}
