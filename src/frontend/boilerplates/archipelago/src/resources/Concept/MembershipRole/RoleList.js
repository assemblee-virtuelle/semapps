import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';

const RoleList = props => (
  <List {...props}>
    <SimpleList primaryText={record => record['pair:label']} />
  </List>
);

export default RoleList;
