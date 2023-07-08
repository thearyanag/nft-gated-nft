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
import Modal from "react-bootstrap/Modal";
import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import styles from "@/styles/Wallet.module.css";

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
        dialogClassName="modal-90w"
        centered
        show={show}
        onHide={handleClose}
        className="modal"
      >
        <Container className={styles.modal}>
          <Row>
            <Col>
              <h2>Send this NFT to a Solana Wallet</h2>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              {hasTransfered && (
                <Card body className={styles.modal_success}>
                  NFT sent! It should be available in the destination wallet in
                  just a few moments.{" "}
                </Card>
              )}
              {!hasTransfered && (
                <>
                  <h6 className={styles.modal_text}>Solana Wallet Address</h6>
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
                    <Card body className={styles.modal_fail}>
                      This doesn’t look like a valid Solana wallet address.
                    </Card>
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
                    className={styles.cancel}
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
                    className={styles.next}
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
              <Col sm={9}>
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
              <Col sm={2}>
                <Button
                  variant="outline-warning"
                  onClick={() => signOut()}
                  className={styles.logout}
                >
                  Logout
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 className={styles.your_collectibles}>Your Collectibles</h6>
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
                        className={styles.transfer}
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
