import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';

const PersonList = props => (
  <List sort={{ field: 'pair:lastName', order: 'DESC' }} {...props}>
    <SimpleList
      primaryText={record => `${record['pair:firstName']} ${record['pair:lastName'].toUpperCase()}`}
      secondaryText={record => record['pair:comment']}
      leftAvatar={record => (
        <img src={record['image'] || process.env.PUBLIC_URL + '/unknown-user.png'} width="100%" alt="SemApps" />
      )}
      linkType="show"
    />
  </List>
);

export default PersonList;
