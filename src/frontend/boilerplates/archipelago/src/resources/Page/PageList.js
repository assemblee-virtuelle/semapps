import React from 'react';
import { Avatar } from '@material-ui/core';
import { ListWithPermissions } from '@semapps/auth-provider';
import { SimpleList } from '@semapps/archipelago-layout';
import DescriptionIcon from '@material-ui/icons/Description';

const PageList = props => (
  <ListWithPermissions {...props}>
    <SimpleList
      primaryText={record => record['semapps:title']}
      leftAvatar={() => (
        <Avatar width="100%">
          <DescriptionIcon />
        </Avatar>
      )}
      linkType="show"
    />
  </ListWithPermissions>
);

export default PageList;
