import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
// import "./index.css";
import React, { useState } from "react";
import UserConnected from "./UserConnected";
import Image from "react-bootstrap/Image";
import { signIn, useSession } from 'next-auth/react';
import styles from "@/pages/components/navbar.module.css"

const connectTwitter = () => {
  signIn("twitter");
};

function NavBar() {
  const { data: session , status } = useSession();
  

  return (
    <>
      <Navbar bg="#1A1A1D" variant="dark">
        <Container style={{"marginTop" : "auto", "marginBottom" : "auto"}}>
          <Navbar.Brand href="#home">
            <Image
              src="./hola-logo.svg"
              className="d-inline-block align-bottom"
              alt=" "
            />
          </Navbar.Brand>
          <Nav>
            {status === "authenticated" ? (
              <UserConnected />
            ) : (
              <Button variant="warning" onClick={() => connectTwitter()} size="m" className={styles.connect}>
                Connect Twitter
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <br />
    </>
  );
}

export default NavBar;
