import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethConnect } from "@lit-protocol/auth-browser";
import { providers } from "ethers";

const litNodeClient = new LitJsSdk.LitNodeClient({});
const connectPromise = litNodeClient.connect();

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

export async function encryptStringWithEOAAccess(
  chainId: number,
  provider: providers.Web3Provider,
  account: string,
  externalAccount: string,
  stringToEncrypt: string
) {
  const litNodeClient = await waitForConnect();
  const authSig = await getAuthSig(provider, account, chainId);

  const cid = await LitJsSdk.encryptToIpfs({
    authSig,
    litNodeClient: litNodeClient as any,
    chain: "filecoin",
    accessControlConditions: createACLForAccount(externalAccount, "filecoin"),
    string: stringToEncrypt,
    infuraId: import.meta.env.VITE_INFURA_ID,
    infuraSecretKey: import.meta.env.VITE_INFURA_SECRET_KEY,
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
