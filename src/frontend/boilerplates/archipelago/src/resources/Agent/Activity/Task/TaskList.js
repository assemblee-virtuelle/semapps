import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import { DateField, TextField, ReferenceArrayField, SingleFieldList, ChipField } from 'react-admin';
import TaskFilterSidebar from './TaskFilterSidebar';
import { Avatar } from '@material-ui/core';
import TaskIcon from '@material-ui/icons/PlaylistAddCheck';

const TaskList = props => (
  <List aside={<TaskFilterSidebar />} {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => (
        <>
          Daedline : <DateField record={record} source="pair:dueDate" showTime />
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
  </List>
);

export default TaskList;
