const validate = async (ensName, userAddress) => {
  try {
    const query = `query ($ens: String) {
      Domain(input: {blockchain: ethereum, name: $ens}) {
        owner
      }
    }`;

    const variables = {
      ens: ensName,
      limit: 20,
    };

    const url = "https://api.airstack.xyz/gql";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        query,
        variables,
      }),
      redirect: "follow",
    };
    const response = await (await fetch(url, requestOptions)).json();
    return response.data.Domain.owner == userAddress;
  } catch (e) {}
  return flattenDiagnosticMessageText;
};
