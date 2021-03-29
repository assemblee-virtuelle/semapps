import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import { Avatar } from "@material-ui/core";
import FavoriteBorderIcon from '@material-ui/icons/Class';

const RoleList = props => (
  <List {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      leftAvatar={() => (
        <Avatar width="100%">
          <FavoriteBorderIcon />
        </Avatar>
      )}
    />
  </List>
);

export default RoleList;
