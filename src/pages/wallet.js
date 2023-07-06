import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AiOutlineCopy } from "react-icons/ai";
import { Form } from "react-bootstrap";
import { signOut } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
// import "./index.css";
import Condition from "./components/Conditions.js";
import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";

// function to check for valid web3 address
function isValidAddress(address) {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

function Home({ props }) {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);

  const router = useRouter();

  const [isValid, setIsValid] = useState(true);

  const [userWallet, setUserWallet] = useState("");
  const [hasInitiatedTransfer, setHasInitiatedTransfer] = useState(false);
  const [hasTransfered, setHasTransfered] = useState(false);

  const [mintId, setMintId] = useState(0);

  const [purchase, setPurchase] = useState([]);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    if (session) {
      const res = fetch("/api/fetchWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      res.then((response) => {
        response.json().then((data) => {
          setUserWallet(data.wallet);
          console.log("wallet", data.wallet);
          const res2 = fetch("/api/getpurchased", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ wallet: data.wallet }),
          });
          res2.then((response) => {
            response.json().then((data) => {
              console.log("data", data);
              setPurchase(data);
            });
          });
        });
      });
    }
  }, [session]);

  const onTransfer = (wallet) => {
    setHasInitiatedTransfer(true);
    let res = fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wallet: wallet, mintId: mintId }),
    });
    res.then((response) => {
      console.log("response", response);
      response.json().then((data) => {
        console.log("data", data);
        if (data.status) {
          setHasTransfered(true);
        }
      });
    });
  };

  if (status == "unauthenticated") {
    router.push("/");
  }

  return (
    <>
      <Modal
        {...props}
        // size="md"
        dialogClassName="modal-90w"
        // aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
        className="modal"
      >
        <Container
          style={{
            padding: "4rem",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Row>
            <Col>
              <h2>Send this NFT to a Solana Wallet</h2>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              {hasTransfered && (
                <Card
                  body
                  style={{
                    borderRadius: "5px",
                    background: "rgba(98, 142, 54, 0.25)",
                    color: "white",
                  }}
                >
                  NFT sent! It should be available in the destination wallet in
                  just a few moments.{" "}
                </Card>
              )}
              {!hasTransfered && (
                <>
                  <h6 style={{ opacity: "0.5", textAlign: "left" }}>
                    Solana Wallet Address
                  </h6>
                  <Form.Control
                    style={{
                      borderRadius: "50px",
                      background: "#2B2B2B",
                      color: "white",
                    }}
                    type="text"
                    placeholder="..."
                    id="wallet"
                    color="white"
                  />
                  {!isValid && (
                    <p style={{ color: "red" }}>
                      Invalid Solana Wallet Address
                    </p>
                  )}
                </>
              )}
            </Col>
          </Row>
          <br />
          <Row>
            {/* cancel button */}
            {hasTransfered && (
              <Col>
                <Button
                  variant="outline-warning"
                  onClick={() => {
                    handleClose();
                  }}
                  style={{ borderRadius: "50px" }}
                >
                  Cancel
                </Button>{" "}
              </Col>
            )}
            {!hasTransfered && (
              <>
                <Col>
                  <Button
                    variant="outline-warning"
                    onClick={() => {
                      handleClose();
                    }}
                    style={{ borderRadius: "50px" }}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="warning"
                    disabled={hasInitiatedTransfer}
                    onClick={() => {
                      let wallet = document.getElementById("wallet").value;
                      if (!isValidAddress(wallet)) {
                        setIsValid(false);
                        return;
                      }
                      onTransfer(wallet);
                    }}
                    style={{ borderRadius: "50px" }}
                  >
                    {hasInitiatedTransfer ? (
                      <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      "Next"
                    )}
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Container>
      </Modal>

      <Container
        style={{ justifyContent: "center", display: "flex", width: "75%" }}
      >
        {status == "authenticated" ? (
          <Stack direction="" gap={4} style={{ marginTop: "10em" }}>
            <Row>
              <Col sm={1}>
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width="80"
                  height="80"
                  className="rounded-circle"
                />
              </Col>
              <Col sm={8}>
                <h2>{session.user.name}</h2>
                <h6 style={{ opacity: "0.5" }}>Wallet Address</h6>
                <span style={{ display: "flex" }}>
                  {userWallet.substring(0, 7)}...
                  {userWallet.substring(userWallet.length - 8)}{" "}
                  <Button
                    variant="link"
                    onClick={() =>
                      navigator.clipboard
                        .writeText(userWallet)
                        .then(() => alert("Copied to clipboard"))
                    }
                    size="sm"
                  >
                    <AiOutlineCopy />
                  </Button>
                </span>
              </Col>
              <Col sm={3}>
                <Button
                  variant="outline-warning"
                  onClick={() => signOut()}
                  style={{ borderRadius: "50px" }}
                >
                  Logout
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ display: "flex", justifyContent: "center" }}>
                  Your Collectibles
                </h6>
              </Col>
              <hr />
            </Row>
            <Row>
              {purchase.map((item) => (
                <Col>
                  <Card
                    style={{ width: "10rem" }}
                    bg="dark"
                    variant="dark"
                    text="white"
                    border="secondary"
                  >
                    <Card.Img
                      variant="top"
                      src={item.image}
                      id={item.mintId}
                      alt={item.name}
                    />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Button
                        variant="outline-warning"
                        style={{ borderRadius: "50px" }}
                        onClick={() => {
                          setMintId(item.mintId);
                          handleShow();
                        }}
                      >
                        Transfer
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Stack>
        ) : (
          <div>
            <h1>Wallet</h1>
            <h2>{userWallet}</h2>
          </div>
        )}
      </Container>
    </>
  );
}

export default Home;
