import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';

const UserList = props => (
  <List sort={{ field: 'foaf:name', order: 'DESC' }} {...props}>
    <SimpleList
      primaryText={record => `${record['foaf:name']} ${record['foaf:familyName']?record['foaf:familyName'].toUpperCase():''}`}
      leftAvatar={() => <img src={process.env.PUBLIC_URL + '/unknown-user.png'} width="100%" alt="SemApps" />}
      linkType="show"
    />
  </List>
);

export default UserList;
