import { useState } from "react";
import { useSetAtom } from "jotai";
import { useAccount, useChainId } from "wagmi";

import '../main.css';
import { itemsAtom } from "../state/items";
import { api } from "../api/api";

import { encryptFileWithEOAAccess } from "../lit-sdk";
import { useEthersSigner } from "../hooks/useEthersSigner";

const shortenString = (text: string) => (text.length > 18)? text.slice(0, 9) + ".." + text.slice(-9) : text;

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

  const port = window.location.port ? `:${window.location.port}` : "";
  const link = `${window.location.protocol}//${window.location.hostname}${port}/item/${itemId}`;

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
          <div className="margin-top-medium">Your item is ready to be distributed!</div>
          <img
            className="margin-top-small"
            id="watermarked-image"
            width="150px"
            src={URL.createObjectURL(imageBlob)}
          />
          <div className="margin-top-small">
            Link: <a href={link}>{shortenString(link)}</a>
          </div>
        </>
      )}
    </div>
  );
}
