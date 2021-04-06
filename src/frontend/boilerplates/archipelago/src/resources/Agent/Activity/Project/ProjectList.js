import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import ProjectFilterSidebar from './ProjectFilterSidebar';
import { Avatar } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

const ProjectList = props => (
  <List aside={<ProjectFilterSidebar />} {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => record['pair:comment']}
      leftAvatar={() => (
        <Avatar width="100%">
          <SettingsIcon />
        </Avatar>
      )}
      linkType="show"
    />
  </List>
);

export default ProjectList;
