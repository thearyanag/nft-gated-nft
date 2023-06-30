import axios from 'axios';

export default async (req, res) => {
    const url = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_ACCESS_TOKEN}`

    let NFT_URL = process.env.NEXT_PUBLIC_NFT_URL;
    let NFT_ID = NFT_URL.split("/")
    NFT_ID = NFT_ID[NFT_ID.length - 1];

    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAsset',
        params: {
            id: `${NFT_ID}`
        },
        }),
    });
    const { result } = await response.json();
    let json_uri = result.content.json_uri;

    const response2 = await fetch(json_uri);
    let imageURL = await response2.json();
    imageURL = imageURL.image;
    return res.status(200).json({ imageURL });
};


  
