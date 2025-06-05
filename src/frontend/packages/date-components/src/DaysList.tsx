import React from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import useFullCalendarProps from './useFullCalendarProps';
import { makeStyles } from '@mui/material';

const useGlobalStyles = makeStyles((theme: any) => ({
  '@global': {
    '.fc-button': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      border: 'none !important',
      opacity: '1 !important'
    }
  }
}));

const DaysList = (props: any) => {
  const fullCalendarProps = useFullCalendarProps(props);
  useGlobalStyles();

  // @ts-expect-error TS(2769): No overload matches this call.
  return <FullCalendar plugins={[listPlugin]} locale={props.locale} initialView="listMonth" {...fullCalendarProps} />;
};

export default DaysList;
