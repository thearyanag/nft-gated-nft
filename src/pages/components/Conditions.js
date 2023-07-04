import React from "react";
import { SlCheck } from "react-icons/sl";
import { RxCrossCircled } from "react-icons/rx";
import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
          {prop.text} {prop.tweet && <a href={prop.tweet}>Link</a>}
        </Col>

        <Col sm={2}>{isConditionMet ? <SlCheck /> : <RxCrossCircled />}</Col>
      </Row>
    </div>
  );
}

export default Condition;
