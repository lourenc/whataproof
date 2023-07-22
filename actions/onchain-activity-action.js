const validate = async (quicknodeKeys, userAddress) => {
  const networksDetails = [
    {
      name: "patient-rough-darkness",
      interval: 214200,
    },
    {
      name: "black-blissful-dream.matic",
      interval: 1200000,
    },
  ];

  try {
    const quicknodeUrl = "quiknode.pro";
    let amountOfTx = 0;
    for (let i = 0; i < networksDetails.length; i++) {
      const quickNodeKey = quicknodeKeys[i];
      const networksDetail = networksDetails[i];
      const url = `https://${networksDetail.name}.${quicknodeUrl}/${quickNodeKey}`;
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: "",
        redirect: "follow",
      };
      var rawBlockRequest = JSON.stringify({
        method: "eth_blockNumber",
        params: [],
        id: 1,
        jsonrpc: "2.0",
      });

      requestOptions.body = rawBlockRequest;
      const blockNumberRes = await (await fetch(url, requestOptions)).json();
      console.log(blockNumberRes);

      var raw = JSON.stringify({
        id: 67,
        jsonrpc: "2.0",
        method: "qn_getTransactionsByAddress",
        params: [
          {
            address: userAddress,
            page: 1,
            perPage: 1,
            fromBlock: parseInt(
              blockNumberRes.result - networksDetail.interval
            ),
            toBlock: parseInt(blockNumberRes.result),
          },
        ],
      });

      requestOptions.body = raw;
      const res = await (await fetch(url, requestOptions)).json();

      amountOfTx += res.result.totalItems;
    }
    return amountOfTx;
  } catch (e) {}
  return 0;
};
