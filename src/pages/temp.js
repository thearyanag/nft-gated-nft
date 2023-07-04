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

// import "./index.css";
import Condition from "./components/Conditions.js";
import React from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function Home({ props }) {
  const { data: session, status } = useSession();

  const [userWallet, setUserWallet] = useState("");
  const [hasInitiatedTransfer, setHasInitiatedTransfer] = useState(false);
  const [hasTransfered, setHasTransfered] = useState(false);

  const [purchase, setPurchase] = useState([]);

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

  const onTransfer = () => {
    let wallet = document.getElementById("wallet").value;
    console.log("wallet", wallet);
    let res = fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wallet: wallet }),
    });

    res.then((response) => {
      console.log("response", response);
      response.json().then((data) => {
        console.log("data", data);
      });
    });
  };

  if (status == "unauthenticated") return <div>unauthenticated</div>;

  return (
    <Container>
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
                  <Card.Img variant="top" src={item.image} alt={item.name} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
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
  );
}

export default Home;
