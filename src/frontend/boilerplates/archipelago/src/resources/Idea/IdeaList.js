import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import IdeaFilterSidebar from './IdeaFilterSidebar';
import { Avatar } from '@material-ui/core';
import IdeaIcon from '@material-ui/icons/EmojiObjects';

const IdeaList = props => (
  <List aside={<IdeaFilterSidebar />} {...props}>
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
  </List>
);

export default IdeaList;
