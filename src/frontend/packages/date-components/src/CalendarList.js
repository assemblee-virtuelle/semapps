import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useListContext, linkToRecord } from 'react-admin';
import { makeStyles, useTheme } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  '@global': {
    '.fc-button': {
      backgroundColor: theme.palette.primary.main + ' !important',
      border: 'none !important',
      opacity: '1 !important'
    }
  }
}));

const CalendarList = ({ linkType }) => {
  const theme = useTheme();
  const history = useHistory();
  const { ids, data, basePath } = useListContext();
  useStyles();

  // Bypass the link in order to use React-Router
  const eventClick = useCallback(({ event, jsEvent }) => {
    jsEvent.preventDefault();
    history.push(event.url);
  }, []);

  const events = useMemo(
    () =>
      ids.map(id => ({
        id,
        title: data[id]['pair:label'],
        start: data[id]['pair:startDate'],
        end: data[id]['pair:endDate'],
        url: linkToRecord(basePath, id) + '/' + linkType
      })),
    [data, ids]
  );

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      locale={frLocale}
      // headerToolbar={false}
      initialView="dayGridMonth"
      events={events}
      eventBackgroundColor={theme.palette.primary.main}
      eventClick={eventClick}
    />
  );
};

CalendarList.defaultProps = {
  linkType: 'show'
};

export default CalendarList;
