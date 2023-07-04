import axios from "axios";

let createCustomerQuery = `
mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      customer {
        id
      }
    }
  }
`;

let createCustomerWalletQuery = `
mutation CreateCustomerWallet($input: CreateCustomerWalletInput!) {
    createCustomerWallet(input: $input) {
      wallet {
        address
      }
    }
  }
`;

let NFTMintQuery = `
mutation MintNft($input: MintDropInput!) {
    mintEdition(input: $input) {
      collectionMint {
        address
        owner
      }
  }
}
`;

let getProjectQuery = `query ($project: UUID!) {
  project(id: $project) {
    id
    drops {
      id
      collection {
        metadataJson {
          id
          image
          name
        }
      }
      purchases {
        wallet
        txSignature
      }
    }
  }
}
`;

export async function createCustomer() {
  let variables = {
    input: {
      project: `${process.env.HOLAPLEX_PROJECT_ID}`,
    },
  };

  console.log(variables);

  let response = await axios.post(
    process.env.HOLAPLEX_API_URL,
    {
      query: createCustomerQuery,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.HOLAPLEX_ACCESS_TOKEN,
      },
    }
  );

  console.log(response.data.data.createCustomer.customer);

  return response.data.data.createCustomer.customer.id;
}

export async function createCustomerWallet(customerId) {
  let variables = {
    input: {
      customer: customerId,
      assetType: "SOL",
    },
  };

  let response = await axios.post(
    process.env.HOLAPLEX_API_URL,
    {
      query: createCustomerWalletQuery,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.HOLAPLEX_ACCESS_TOKEN,
      },
    }
  );

  console.log(response.data.data.createCustomerWallet.wallet.address);

  return response.data.data.createCustomerWallet.wallet.address;
}

export async function mintNFT(customerWalletAddress) {
  let variables = {
    input: {
      drop: `${process.env.HOLAPLEX_DROP_ID}`,
      recipient: `${customerWalletAddress}`,
    },
  };

  console.log(process.env.HOLAPLEX_ACCESS_TOKEN);

  let response = await axios.post(
    process.env.HOLAPLEX_API_URL,
    {
      query: NFTMintQuery,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.HOLAPLEX_ACCESS_TOKEN,
      },
    }
  );

  if (response.data.errors) return false;

  console.log(response.data.data.mintEdition.collectionMint.owner);

  if (response.data.data.mintEdition.collectionMint.owner) {
    return true;
  } else {
    return false;
  }
}

export async function getProject() {
  let projectId = process.env.HOLAPLEX_PROJECT_ID;
  let dropId = process.env.HOLAPLEX_DROP_ID;

  let variables = {
    project: `${projectId}`,
  };

  console.log(variables);

  let response = await axios.post(
    process.env.HOLAPLEX_API_URL,
    {
      query: getProjectQuery,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.HOLAPLEX_ACCESS_TOKEN,
      },
    }
  );

  let drops = response.data.data.project.drops;

  for (let i = 0; i < drops.length; i++) {
    if (drops[i].id == dropId) {
      console.log("yes");
      return drops[i].collection.metadataJson.image;
    }
  }

  return "";
}

export async function getPurchasedDrop(wallet) {
  let projectId = process.env.HOLAPLEX_PROJECT_ID;

  let variables = {
    project: `${projectId}`,
  };

  console.log(variables);

  let response = await axios.post(
    process.env.HOLAPLEX_API_URL,
    {
      query: getProjectQuery,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.HOLAPLEX_ACCESS_TOKEN,
      },
    }
  );

  let drops = response.data.data.project.drops;

  let purchase = [];

  for (let i = 0; i < drops.length; i++) {
    if (drops[i].purchases) {
      for (let j = 0; j < drops[i].purchases.length; j++) {
        if (drops[i].purchases[j].wallet == wallet) {
          purchase.push({
            image: drops[i].collection.metadataJson.image,
            txSignature: drops[i].purchases[j].txSignature,
            name : drops[i].collection.metadataJson.name,
            key : drops[i].id
          });
          break;
        }
      }
    }
  }

  return purchase;
}
