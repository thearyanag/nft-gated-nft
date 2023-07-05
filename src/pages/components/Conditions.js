import React from "react";
import { SlCheck } from "react-icons/sl";
import { RxCrossCircled } from "react-icons/rx";
import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "next/image";

function Condition(prop) {
  const [isConditionMet, setIsConditionMet] = useState(false);

  useEffect(() => {
    setIsConditionMet(prop.state);
  }, [prop.state]);

  return (
    <div>
      <hr />
      <Row>
        <Col sm={10}>
          {prop.text}{" "}
          {prop.tweet && (
            <a
              href={prop.tweet}
              target="_blank"
              style={{ color: "white", textUnderlineOffset: "4" }}
            >
              this tweet
            </a>
          )}
        </Col>

        <Col sm={2}>
          {isConditionMet ? (
            <Image src={"/check.png"} width={"32"} height={"32"} />
          ) : (
            <Image src={"/x.png"} width={"32"} height={"32"} />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Condition;
