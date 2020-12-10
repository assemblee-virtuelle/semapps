import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';

const PlaceList = props => (
  <List {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      leftAvatar={() => <img src={process.env.PUBLIC_URL + '/logo192.png'} width="100%" alt="SemApps" />}
      linkType="show"
    />
  </List>
);

export default PlaceList;
