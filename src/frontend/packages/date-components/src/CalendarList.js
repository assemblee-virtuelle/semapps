import React, { useMemo, useCallback } from 'react';
import { useHistory } from "react-router-dom";
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
    },
    '.fc-day-today': {
      backgroundColor: theme.palette.secondary.light + ' !important'
    },
    // Overwrite violet color of links
    'a.fc-daygrid-dot-event': {
      color: 'black !important'
    }
  }
}));

const CalendarList = ({ label, startDate, endDate, linkType  }) => {
  const theme = useTheme();
  const history = useHistory();
  const { ids, data, basePath } = useListContext();
  useStyles();

  let query = new URLSearchParams(history.location.search);

  // Bypass the link in order to use React-Router
  const eventClick = useCallback(({ event, jsEvent }) => {
    jsEvent.preventDefault();
    history.push(event.url);
  }, []);

  // Change the query string when month change
  const datesSet = useCallback(({ view }) => {
    query.set('month', view.currentStart.getMonth() + 1);
    query.set('year', view.currentStart.getFullYear());
    history.replace({ pathname: history.location.pathname, search: '?' + query.toString() });
  }, [query])

  const events = useMemo(() => ids.map(id => ({
      id,
      title: label && label(data[id]),
      start: startDate && startDate(data[id]),
      end: endDate && endDate(data[id]),
      url: linkToRecord(basePath, id) + '/' + linkType
  })), [data, ids, basePath]);

  return(
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      locale={frLocale}
      initialView='dayGridMonth'
      initialDate={query.has('month') ? new Date(query.get('year'), query.get('month')-1) : new Date()}
      events={events}
      datesSet={datesSet}
      eventBackgroundColor={theme.palette.primary.main}
      eventClick={eventClick}
      nowIndicator
    />
  );
};

CalendarList.defaultProps = {
  linkType: 'edit'
};

export default CalendarList;
