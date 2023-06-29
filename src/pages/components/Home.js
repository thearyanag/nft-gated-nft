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

function Home() {
  const [isCondition1Met, setIsCondition1Met] = useState(false);
  const [isCondition2Met, setIsCondition2Met] = useState(true);
  const [isCondition3Met, setIsCondition3Met] = useState(true);

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
          <Image src="./frame.png" rounded />
        </div>
        <div className="">
          <Stack gap={3}>
            <div>
              <h1>Holaplex Hub NFT</h1>
              <h3>Do some stuff and claim a free NFT</h3>
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
                    <Button disabled={true} variant="warning" size="m">
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
