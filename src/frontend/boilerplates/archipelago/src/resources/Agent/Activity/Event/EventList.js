import React from 'react';
import { MultiViewsList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import { CalendarList, DaysList } from "@semapps/date-components";
import frLocale from '@fullcalendar/core/locales/fr';
import ListIcon from "@material-ui/icons/List";
import EventIcon from '@material-ui/icons/Event';
import EventFilterSidebar from './EventFilterSidebar';

const EventList = props => (
  <MultiViewsList
    ListComponent={ListWithPermissions}
    aside={<EventFilterSidebar />}
    views={{
      calendar: {
        label: 'Calendrier',
        icon: EventIcon,
        perPage: 1000,
        pagination: false,
        list: (
          <CalendarList
            locale={frLocale}
            label="pair:label"
            startDate="pair:startDate"
            endDate="pair:endDate"
            linkType="show"
          />
        )
      },
      list: {
        label: 'Liste',
        icon: ListIcon,
        perPage: 1000,
        pagination: false,
        list: (
          <DaysList
            locale={frLocale}
            label="pair:label"
            startDate="pair:startDate"
            endDate="pair:endDate"
            linkType="show"
          />
        )
      }
    }}
    {...props}
  />
);

export default EventList;
