import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { makeStyles, useTheme } from '@mui/material';
import useFullCalendarProps from './useFullCalendarProps';

const useGlobalStyles = makeStyles((theme: any) => ({
  '@global': {
    '.fc-button': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      border: 'none !important',
      opacity: '1 !important'
    },
    '.fc-day-today': {
      backgroundColor: `${theme.palette.secondary.light} !important`
    },
    // Overwrite violet color of links
    'a.fc-daygrid-dot-event': {
      color: 'black !important'
    }
  }
}));

const CalendarList = (props: any) => {
  const theme = useTheme();
  const fullCalendarProps = useFullCalendarProps(props);
  // @ts-expect-error TS(2349): This expression is not callable.
  useGlobalStyles();

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <FullCalendar
      plugins={[dayGridPlugin]}
      locale={props.locale}
      initialView="dayGridMonth"
      eventBackgroundColor={theme.palette.primary.main}
      {...fullCalendarProps}
    />
  );
};

export default CalendarList;
