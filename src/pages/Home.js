import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HiRefresh } from "react-icons/hi";
import Spinner from "react-bootstrap/Spinner";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

import { useState } from "react";

// import "./index.css";
import Condition from "./components/Conditions.js";
import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

function Home({ props }) {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [userWallet, setUserWallet] = useState("");
  const [hasInitiatedCheck, setHasInitiatedCheck] = useState(false);
  const [isCondition1Met, setIsCondition1Met] = useState(false);
  const [isCondition2Met, setIsCondition2Met] = useState(false);
  const [isCondition3Met, setIsCondition3Met] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
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
      if(userWallet) return; 
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
          onLike();
          setUserWallet(data.wallet);
        });
      });
      // onLike();
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
          // alert("Minted to your wallet");
          setHasMinted(true);
        } else {
          alert("You were late. Try again next time.");
        }
      });
    });
  };

  const onLike = async () => {
    setHasInitiatedCheck(true);
    // if(!userWallet) return;
    if (!isCondition1Met) {
      let res_1 = fetch("/api/twitter/getTL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      res_1.then((response) => {
        response.json().then((data) => {
          setIsCondition3Met(data.status);
          setHasInitiatedCheck(false);
        });
      });
    }

    if (!isCondition2Met) {
      let res_2 = fetch("/api/twitter/getLikedResult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      res_2.then((response) => {
        response.json().then((data) => {
          setIsCondition2Met(data.status);
          setHasInitiatedCheck(false);
        });
      });
    }
  };

  const [isClaimable, setIsClaimable] = useState(false);

  useEffect(() => {
    if (isCondition1Met && isCondition2Met && isCondition3Met) {
      setIsClaimable(true);
    }
  }, [isCondition1Met, isCondition2Met, isCondition3Met]);

  return (
    <Container
      style={{ justifyContent: "center", display: "flex", marginTop: "3rem" }}
    >
      <Stack direction="horizontal" gap={5}>
        <div>
          <a href={nft_url} target="_blank">
            <Image src={image} alt="holaplex" rounded width={"400rem"} />
          </a>
        </div>
        <div className="">
          <Stack gap={1}>
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
            <hr />
            <Card className="bg-dark text-light round">
              {" "}
              <Card.Body>
                <Row className={styles.card}>
                  {/* <Col sm={6}>Criteria Met:</Col> */}
                  {isClaimable ? (
                    <Col sm={hasMinted ? 7 : 8}>Criteria Met! </Col>
                  ) : (
                    <Col sm={hasMinted ? 7 : 8}>Criteria Not Met :(</Col>
                  )}
                  <Col sm={hasMinted ? 5 : 4}>
                    {!hasMinted ? (
                      <Button
                        disabled={!isClaimable}
                        onClick={onTransfer}
                        variant="warning"
                        size="m"
                        className={styles.button}
                      >
                        Claim Now
                      </Button>
                    ) : (
                      <Button
                        onClick={() => router.push("/wallet")}
                        variant="outline-warning"
                        size="m"
                        className={styles.wallet}
                      >
                        View in Wallet
                      </Button>
                    )}
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
