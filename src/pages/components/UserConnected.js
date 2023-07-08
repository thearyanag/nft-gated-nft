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
      <Dropdown className={styles.dropdown}>
        <Dropdown.Toggle variant="outline-warning" className={styles.profile}>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width="30"
              height="30"
              className="rounded-circle"
              style={{ marginRight: "0.5rem" }}
            />
          )}{" @"}
          {session.twitter.twitterHandle}
        </Dropdown.Toggle>{" "}
        <Dropdown.Menu  style={{"background" : "#212122" }}>
          <Dropdown.Item  className={styles.dropdown_menu} href="/wallet">View Wallet</Dropdown.Item>
          <Dropdown.Item  className={styles.dropdown_menu} dropdown-item onClick={() => signOut()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserConnected;
