import React from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import useFullCalendarProps from './useFullCalendarProps';
import { makeStyles } from '@mui/material';

const useGlobalStyles = makeStyles(theme => ({
  '@global': {
    '.fc-button': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      border: 'none !important',
      opacity: '1 !important'
    }
  }
}));

const DaysList = props => {
  const fullCalendarProps = useFullCalendarProps(props);
  useGlobalStyles();

  return <FullCalendar plugins={[listPlugin]} locale={props.locale} initialView="listMonth" {...fullCalendarProps} />;
};

export default DaysList;
