import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import StyleIcon from '@material-ui/icons/Style';

const TypeList = props => (
  <List {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => record.type}
      leftAvatar={() => <StyleIcon />}
    />
  </List>
);

export default TypeList;
