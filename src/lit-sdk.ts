import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethConnect } from "@lit-protocol/auth-browser";
import { providers } from "ethers";
import { Web3Storage } from "web3.storage";
import { uint8arrayToString } from "@lit-protocol/uint8arrays";
import {
  AuthSig,
  AccessControlConditions,
  EvmContractConditions,
  SolRpcConditions,
  UnifiedAccessControlConditions,
  Chain,
  ILitNodeClient,
} from "@lit-protocol/types";

const litNodeClient = new LitJsSdk.LitNodeClient({});
const connectPromise = litNodeClient.connect();
const web3StorageClient = new Web3Storage({
  token: import.meta.env.VITE_WEB3_STORAGE_API_KEY,
});

export function waitForConnect() {
  return connectPromise.then(() => litNodeClient);
}

export async function getAuthSig(
  provider: providers.Web3Provider,
  account: string,
  chainId: number
) {
  await waitForConnect();

  return ethConnect.signAndSaveAuthMessage({
    web3: provider,
    chainId,
    account,
    expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    resources: ["lit:auth"],
  });
}

export function createACLForAccount(account: string, chain: string) {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: account,
      },
    },
  ];
}

export interface EncryptToWeb3StorageProps {
  authSig?: AuthSig;
  sessionSigs?: any;
  accessControlConditions?: AccessControlConditions;
  evmContractConditions?: EvmContractConditions;
  solRpcConditions?: SolRpcConditions;
  unifiedAccessControlConditions?: UnifiedAccessControlConditions;
  chain: Chain;
  string: string;
  litNodeClient: ILitNodeClient;
}

export async function encryptToWeb3Storage({
  authSig,
  sessionSigs,
  accessControlConditions,
  evmContractConditions,
  solRpcConditions,
  unifiedAccessControlConditions,
  chain,
  string,
  litNodeClient,
}: EncryptToWeb3StorageProps) {
  const encryptedString = await LitJsSdk.encryptString(string);
  const encryptedData = encryptedString.encryptedString;
  const symmetricKey = encryptedString.symmetricKey;

  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    accessControlConditions,
    evmContractConditions,
    solRpcConditions,
    unifiedAccessControlConditions,
    symmetricKey,
    authSig,
    sessionSigs,
    chain,
  });
  console.log("encrypted key saved to Lit", encryptedSymmetricKey);
  const encryptedSymmetricKeyString = uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  );

  const encryptedDataJson = Buffer.from(
    await encryptedData.arrayBuffer()
  ).toJSON();

  try {
    const dataToStore = JSON.stringify({
      [string !== undefined ? "encryptedString" : "encryptedFile"]:
        encryptedDataJson,
      encryptedSymmetricKeyString,
      accessControlConditions,
      evmContractConditions,
      solRpcConditions,
      unifiedAccessControlConditions,
      chain,
    });

    const file = new File([dataToStore], "details", { type: "text/plain" });

    const cid = await web3StorageClient.put([file]);

    return cid;
  } catch (e) {
    console.error(e);
  }
}

export async function encryptStringWithEOAAccess(
  chainId: number,
  provider: providers.Web3Provider,
  account: string,
  externalAccount: string,
  stringToEncrypt: string
) {
  const litNodeClient = await waitForConnect();
  const authSig = await getAuthSig(provider, account, chainId);

  const cid = await encryptToWeb3Storage({
    authSig,
    litNodeClient: litNodeClient as any,
    chain: "filecoin",
    accessControlConditions: createACLForAccount(externalAccount, "filecoin"),
    string: stringToEncrypt,
  });

  return cid;
}

export async function decryptStringWithEOAAccess(
  chainId: number,
  provider: providers.Web3Provider,
  account: string,
  ipfsCid: string
) {
  const litNodeClient = await waitForConnect();
  const authSig = await getAuthSig(provider, account, chainId);

  const decryptedStuff = await LitJsSdk.decryptFromIpfs({
    authSig,
    litNodeClient: litNodeClient as any,
    ipfsCid,
  });

  return decryptedStuff;
}
