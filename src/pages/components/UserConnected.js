import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import  styles from "@/pages/components/connect.module.css";

export const UserConnected = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="outline-warning" style={{"borderRadius" : "50px"}}>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width="30"
              height="30"
              className="rounded-circle"
            />
          )}{" @"}
          {session.twitter.twitterHandle}
        </Dropdown.Toggle>{" "}
        <Dropdown.Menu  style={{"background" : "#212122" }}>
          <Dropdown.Item  className={styles.dropdown} href="/wallet">View Wallet</Dropdown.Item>
          <Dropdown.Item  className={styles.dropdown} dropdown-item onClick={() => signOut()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserConnected;
