import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useFullCalendarProps from './useFullCalendarProps';

const useGlobalStyles = makeStyles(theme => ({
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

const CalendarList = props => {
  const theme = useTheme();
  const fullCalendarProps = useFullCalendarProps(props);
  useGlobalStyles();

  return (
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
