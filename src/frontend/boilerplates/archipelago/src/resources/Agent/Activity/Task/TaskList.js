import React from 'react';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import TaskFilterSidebar from './TaskFilterSidebar';
import { Avatar } from '@material-ui/core';
import TaskIcon from '@material-ui/icons/PlaylistAddCheck';

const TaskList = props => (
  <ListWithPermissions aside={<TaskFilterSidebar />} {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => record['pair:description']}
      leftAvatar={() => (
        <Avatar width="100%">
          <TaskIcon />
        </Avatar>
      )}
      linkType="show"
    />
  </ListWithPermissions>
);

export default TaskList;
