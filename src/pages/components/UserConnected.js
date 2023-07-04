import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';



export const UserConnected = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div>
        <Dropdown>
        <Dropdown.Toggle variant="outline-warning" >
          {session.user.image && <Image src={session.user.image} alt={session.user.name} width="30" height="30" className="rounded-circle" />}
          {" "}
          {session.twitter.twitterHandle}</Dropdown.Toggle>{' '}
         <Dropdown.Menu>
        <Dropdown.Item href="/wallet">View Wallet</Dropdown.Item>
        <Dropdown.Item onClick={() => signOut()}>Logout</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
 
export default UserConnected;

