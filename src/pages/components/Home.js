import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useState } from "react";

// import "./index.css";
import Condition from "./Conditions.js";
import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

function Home({ props }) {
  const { data: session, status } = useSession();

  const [userWallet, setUserWallet] = useState("");
  const [isCondition1Met, setIsCondition1Met] = useState(false);
  const [isCondition2Met, setIsCondition2Met] = useState(false);
  const [isCondition3Met, setIsCondition3Met] = useState(false);
  const [image, setImage] = useState("./frame.png");

  let nft_url = process.env.NEXT_PUBLIC_NFT_URL;

  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch("/api/fetchnftimage");
      const data = await res.json();
      console.log("data", data);
      setImage(data.imageURL);
    };
    fetchImage();
  }, []);

  useEffect(() => {
    if (session) {
      const res = fetch("/api/fetchWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet: session.user.wallet }),
      });
      res.then((response) => {
        response.json().then((data) => {
          console.log("data", data);
          setUserWallet(data.wallet);
        });
      });
      setIsCondition1Met(true);
    }
  }, [session]);

  const onLike = async () => {
    let res = await fetch("/api/twitter/getLikedResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const [isClaimable, setIsClaimable] = useState(false);

  useEffect(() => {
    if (isCondition1Met && isCondition2Met && isCondition3Met) {
      setIsClaimable(true);
    }
  }, [isCondition1Met, isCondition2Met, isCondition3Met]);

  return (
    <Container>
      <Stack direction="horizontal" gap={5}>
        <div>
          <a href={nft_url} target="_blank">
            <Image src={image} alt="holaplex" rounded />
          </a>
        </div>
        <div className="">
          <Stack gap={3}>
            <div>
              <h1>Holaplex Hub NFT</h1>
              <h3>Do some stuff and claim a free NFT</h3>
              <h3>{userWallet}</h3>
            </div>

            <Condition
              id="1"
              text="Connect Your Twitter Account"
              state={isCondition1Met}
            />
            <Condition id="2" text="Like this tweet" state={isCondition2Met} />
            <Condition
              id="3"
              text="Tweet with hashtag #holaplexhub"
              state={isCondition3Met}
            />

            <Card className="bg-dark text-light">
              <Card.Body>
                <Row>
                  <Col sm={8}>Criteria Met:</Col>
                  <Col sm={4}>
                    <Button disabled={!isClaimable} variant="warning" size="m">
                      Claim Now
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}

export default Home;
