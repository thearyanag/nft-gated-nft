import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';


export const UserConnected = () => {
  return (
    <div>
        <Dropdown>
        <Dropdown.Toggle variant="outline-warning">@damiandotsol</Dropdown.Toggle>{' '}
         <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">View Wallet</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Logout</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
 
export default UserConnected;

