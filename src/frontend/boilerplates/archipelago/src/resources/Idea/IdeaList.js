import React from 'react';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import IdeaFilterSidebar from './IdeaFilterSidebar';
import { Avatar } from '@material-ui/core';
import IdeaIcon from '@material-ui/icons/EmojiObjects';

const IdeaList = props => (
  <ListWithPermissions aside={<IdeaFilterSidebar />} {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => record['pair:description']}
      leftAvatar={() => (
        <Avatar width="100%">
          <IdeaIcon />
        </Avatar>
      )}
      linkType="show"
    />
  </ListWithPermissions>
);

export default IdeaList;
