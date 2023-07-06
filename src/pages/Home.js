import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HiRefresh } from "react-icons/hi";
import Spinner from "react-bootstrap/Spinner";


import { useState } from "react";

// import "./index.css";
import Condition from "./components/Conditions.js";
import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

function Home({ props }) {
  const { data: session, status } = useSession();

  const [userWallet, setUserWallet] = useState("");
  const [hasInitiatedCheck, setHasInitiatedCheck] = useState(false);
  const [isCondition1Met, setIsCondition1Met] = useState(false);
  const [isCondition2Met, setIsCondition2Met] = useState(false);
  const [isCondition3Met, setIsCondition3Met] = useState(false);
  const [image, setImage] = useState("./frame.png");

  let nft_url = process.env.NEXT_PUBLIC_NFT_URL;

  let tweet1_url = process.env.NEXT_PUBLIC_TWEET1_URL;
  let tweet2_url = process.env.NEXT_PUBLIC_TWEET2_URL;

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

  const onTransfer = () => {
    let res = fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wallet: userWallet }),
    });

    res.then((response) => {
      console.log("response", response);
      response.json().then((data) => {
        console.log("data", data);
        if (data.status) {
          alert("Minted to your wallet");
          setHasMinted(true);
        } else {
          alert("You were late. Try again next time.");
        }
      });
    });
  };

  const onLike = async () => {
    setHasInitiatedCheck(true);
    let res_1 = fetch("/api/twitter/getTL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let res_2 = fetch("/api/twitter/getLikedResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    res_1.then((response) => {
      response.json().then((data) => {
        console.log("data", data);
        console.log("data", data.status);
        setIsCondition3Met(data.status);
        setHasInitiatedCheck(false);
      });
    });

    res_2.then((response) => {
      response.json().then((data) => {
        console.log("data", data);
        console.log("data", data.status);
        setIsCondition2Met(data.status);
        setHasInitiatedCheck(false);
      });
    });
  };

  const [isClaimable, setIsClaimable] = useState(false);

  useEffect(() => {
    if (isCondition1Met && isCondition2Met && isCondition3Met) {
      setIsClaimable(true);
    }
  }, [isCondition1Met, isCondition2Met, isCondition3Met]);

  return (
    <Container style={{ justifyContent: "center", display: "flex" }}>
      <Stack direction="horizontal" gap={5}>
        <div>
          <a href={nft_url} target="_blank">
            <Image src={image} alt="holaplex" rounded width={"400rem"} />
          </a>
        </div>
        <div className="">
          <Stack gap={3}>
            <div>
              <h1>Holaplex Hub NFT</h1>
              <h3 style={{ color: "#BDBDBD" }}>
                Do some stuff and claim a free NFT
              </h3>
            </div>

            <Condition
              id="1"
              text="Connect Your Twitter Account"
              state={isCondition1Met}
            />
            <Condition
              id="2"
              text="Like"
              tweet={tweet1_url}
              state={isCondition2Met}
            />
            <Condition
              id="3"
              text="Retweet"
              state={isCondition3Met}
              tweet={tweet2_url}
            />

            <Card className="bg-dark text-light round">
              {" "}
              <Card.Body>
                <Row>
                  {/* <Col sm={6}>Criteria Met:</Col> */}
                  {isClaimable ? (
                    <Col sm={6}>Criteria Met!!</Col>
                  ) : (
                    <Col sm={6}>Criteria Not Met :(</Col>
                  )}
                  <Col sm={2}>
                    {" "}
                    <Button
                      disabled={
                        (!isClaimable && status === "unauthenticated") ||
                        hasInitiatedCheck
                      }
                      onClick={onLike}
                      variant="warning"
                      size="s"
                      style={{ borderRadius: "40px" }}
                    >
                      {hasInitiatedCheck ? <Spinner animation="border" size="sm" /> : <HiRefresh />}
                    </Button>
                  </Col>
                  <Col sm={4}>
                    <Button
                      disabled={!isClaimable}
                      onClick={onTransfer}
                      variant="warning"
                      size="m"
                      style={{ borderRadius: "20px" }}
                    >
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
