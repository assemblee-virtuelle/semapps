import React from 'react';
import {  List, SimpleList } from 'react-admin';

export const UserList = props => (
  <List title="Utilisateurs" perPage={25} {...props}>
    <SimpleList
      primaryText={record => `${record['pair:firstName']} ${record['pair:lastName']}`}
      secondaryText={record => record['pair:comment']}
      leftAvatar={() => <img src={process.env.PUBLIC_URL + '/unknown-user.png'} width="100%" alt="Assemblée virtuelle" />}
      linkType="show"
    />
  </List>
);

export default UserList;
