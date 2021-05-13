import React from 'react';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import { Avatar } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';

const GroupList = props => (
  <ListWithPermissions {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => record['pair:comment']}
      leftAvatar={() => (
        <Avatar width="100%">
          <GroupIcon />
        </Avatar>
      )}
      linkType="show"
    />
  </ListWithPermissions>
);

export default GroupList;
