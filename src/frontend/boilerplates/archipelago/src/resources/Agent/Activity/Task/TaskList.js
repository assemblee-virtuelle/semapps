import React from 'react';
import { DateField, TextField } from 'react-admin';
import { Avatar } from '@material-ui/core';
import TaskIcon from '@material-ui/icons/PlaylistAddCheck';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import TaskFilterSidebar from './TaskFilterSidebar';

const TaskList = props => (
  <ListWithPermissions aside={<TaskFilterSidebar />} {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => (
        <>
          Deadline : <DateField record={record} source="pair:dueDate" showTime />
        </>
      )}
      tertiaryText={record => (
        <>
          <TextField record={record} source="pair:assignedTo" />
        </>
      )}
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
