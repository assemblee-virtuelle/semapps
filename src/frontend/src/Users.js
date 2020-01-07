import React from 'react';
import { List } from '@solid/react';

import { MIDDLEWARE_URL } from './constants';

const Users = () => {
  return (
    <div className="App-form">
      <label>Utilisateurs</label>
      <List
        src={`[${MIDDLEWARE_URL}/ldp/schema:Person].ldp_contains.schema_name`}
        container={items => <div>{items}</div>}
      >
        {(item, index) => {
          console.log('item', item);
          return <p key={index}>{`${item}`} </p>;
        }}
      </List>
    </div>
  );
};

export default Users;
