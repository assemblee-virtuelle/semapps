import React from 'react';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import { Avatar } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/Class';

const RoleList = props => (
  <ListWithPermissions {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      leftAvatar={() => (
        <Avatar width="100%">
          <FavoriteBorderIcon />
        </Avatar>
      )}
    />
  </ListWithPermissions>
);

export default RoleList;
