import React from 'react';
import { DateField } from 'react-admin';
import { List, SimpleList } from '@semapps/archipelago-layout';
import EventFilterSidebar from "./EventFilterSidebar";
import { Avatar } from "@material-ui/core";
import EventIcon from '@material-ui/icons/Event';

const EventList = props => (
  <List aside={<EventFilterSidebar />} {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => (
        <>
          Du&nbsp;
          <DateField record={record} source="pair:startDate" showTime />
          &nbsp;au&nbsp;
          <DateField record={record} source="pair:endDate" showTime />
        </>
      )}
      leftAvatar={() => (
        <Avatar width="100%">
          <EventIcon />
        </Avatar>
      )}
      linkType="show"
    />
  </List>
);

export default EventList;
