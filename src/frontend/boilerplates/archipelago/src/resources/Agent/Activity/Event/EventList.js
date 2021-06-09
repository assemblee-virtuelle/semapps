import React from 'react';
import { DateField } from 'react-admin';
import { MultiViewsList, SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import { CalendarList } from "@semapps/date-components";
import { Avatar } from '@material-ui/core';
import ListIcon from "@material-ui/icons/List";
import EventIcon from '@material-ui/icons/Event';
import EventFilterSidebar from './EventFilterSidebar';

import '@semapps/date-components/dist/index.cjs.css';

const EventList = props => (
  <MultiViewsList
    ListComponent={ListWithPermissions}
    aside={<EventFilterSidebar />}
    views={{
      calendar: {
        label: 'Calendrier',
        icon: EventIcon,
        perPage: 500,
        pagination: false,
        list: (
          <CalendarList linkType="show" />
        )
      },
      list: {
        label: 'Liste',
        icon: ListIcon,
        sort: { field: 'pair:lastName', order: 'DESC' },
        perPage: 25,
        list: (
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
        )
      }
    }}
    {...props}
  />
);

export default EventList;
