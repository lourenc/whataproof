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
  AcceptedFileType,
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

export function createACLForNFT(nftAddress: string, chain: string) {
  return [
    {
      contractAddress: nftAddress,
      standardContractType: "ERC721",
      chain,
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
}

export function createACLForERC20(
  tokenAddress: string,
  minBalance: string,
  chain: string
) {
  return [
    {
      contractAddress: tokenAddress,
      standardContractType: "ERC20",
      chain,
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">=",
        value: minBalance,
      },
    },
  ];
}

const NEXT_ID_API_CALL_IPFS =
  "ipfs://QmSbpQBU6QKN3gY7JdWZzZPXR91eaxLBUxuvLv5JNvo7s1";

export function createACLForNestId(
  platform: string,
  identity: string,
  chain: string
) {
  return [
    {
      contractAddress: NEXT_ID_API_CALL_IPFS,
      standardContractType: "LitAction",
      chain,
      method: "validate",
      parameters: [platform, identity, ":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "true",
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
  file: AcceptedFileType;
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
  file,
  litNodeClient,
}: EncryptToWeb3StorageProps) {
  const encryptedFile = await LitJsSdk.encryptFile({ file: file });
  const encryptedData = encryptedFile.encryptedFile;
  const symmetricKey = encryptedFile.symmetricKey;

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
      encryptedFile: encryptedDataJson,
      encryptedSymmetricKeyString,
      encryptedFileMimeType: file.type,
      accessControlConditions,
      evmContractConditions,
      solRpcConditions,
      unifiedAccessControlConditions,
      chain,
    });

    const fileToStore = new File([dataToStore], "details", {
      type: "text/plain",
    });

    const cid = await web3StorageClient.put([fileToStore]);

    return cid;
  } catch (e) {
    console.error(e);
  }
}

export interface DecryptFromWeb3StorageProps {
  authSig?: AuthSig;
  sessionSigs?: any;
  ipfsCid: string;
  litNodeClient: ILitNodeClient;
}

export async function decryptFromWeb3Storage({
  authSig,
  sessionSigs,
  ipfsCid,
  litNodeClient,
}: DecryptFromWeb3StorageProps) {
  const res = await web3StorageClient.get(ipfsCid);
  const files = await res?.files();
  const file = files ? files[0] : undefined;
  const data = await file?.text();
  if (data) {
    const metadata = JSON.parse(data);
    console.log(metadata);
    const symmetricKey = await litNodeClient.getEncryptionKey({
      accessControlConditions: metadata.accessControlConditions,
      evmContractConditions: metadata.evmContractConditions,
      solRpcConditions: metadata.solRpcConditions,
      unifiedAccessControlConditions: metadata.unifiedAccessControlConditions,
      toDecrypt: metadata.encryptedSymmetricKeyString,
      chain: metadata.chain,
      authSig,
      sessionSigs,
    });

    if (metadata.encryptedFile !== undefined) {
      const encryptedFileBlob = new Blob(
        [Buffer.from(metadata.encryptedFile)],
        {
          type: "application/octet-stream",
        }
      );
      const decryptedFile = await LitJsSdk.decryptFile({
        file: encryptedFileBlob,
        symmetricKey,
      });

      return new Blob([decryptedFile], {
        type: metadata.encryptedFileMimeType,
      });
    }
  }
}

export async function encryptFileWithEOAAccess(
  chainId: number,
  provider: providers.Web3Provider,
  account: string,
  externalAccount: string,
  fileToEncrypt: AcceptedFileType
) {
  const litNodeClient = await waitForConnect();
  const authSig = await getAuthSig(provider, account, chainId);

  const cid = await encryptToWeb3Storage({
    authSig,
    litNodeClient: litNodeClient as any,
    chain: "filecoin",
    accessControlConditions: createACLForAccount(externalAccount, "filecoin"),
    file: fileToEncrypt,
  });

  return cid;
}

export async function decryptFileWithEOAAccess(
  chainId: number,
  provider: providers.Web3Provider,
  account: string,
  ipfsCid: string
) {
  const litNodeClient = await waitForConnect();
  const authSig = await getAuthSig(provider, account, chainId);

  const decryptedStuff = await decryptFromWeb3Storage({
    authSig,
    litNodeClient: litNodeClient as any,
    ipfsCid,
  });

  return decryptedStuff;
}
