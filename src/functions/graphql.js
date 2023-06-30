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
      collection: `${process.env.HOLAPLEX_DROP_ID}`,
      recipient: customerWalletAddress,
    },
  };

  let response = await axios.post(
    process.env.HOLAPLEX_API_URL,
    {
      query: NFTMintQuery,
      variables: variables,
    },
    {
      "Content-Type": "application/json",
      Authorization: process.env.HOLAPLEX_ACCESS_TOKEN,
    }
  );

  console.log(response.data.data.mintEdition.collectionMint.owner);

  return response.data.data.mintEdition.collectionMint.owner;
}
