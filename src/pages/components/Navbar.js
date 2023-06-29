import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
// import "./index.css";
import React, { useState } from "react";
import UserConnected from "./UserConnected";
import Image from "react-bootstrap/Image";

function NavBar() {
  const [isConnected, userIsConnected] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <Image
              src="./hola-logo.svg"
              className="d-inline-block align-bottom"
              alt=" "
            />
          </Navbar.Brand>
          <Nav className="me-auto"></Nav>
          <div className="mb-2">
            {isConnected ? (
              <UserConnected />
            ) : (
              <Button variant="warning" size="m">
                Connect Twitter
              </Button>
            )}
          </div>
        </Container>
      </Navbar>

      <br />
    </>
  );
}

export default NavBar;
