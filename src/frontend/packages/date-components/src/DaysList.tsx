import React from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import { makeStyles } from 'tss-react/mui';
import useFullCalendarProps from './useFullCalendarProps';
import { GlobalStyles } from '@mui/material';

const DaysList = (props: any) => {
  const fullCalendarProps = useFullCalendarProps(props);

  return (
    <>
      <GlobalStyles
        styles={theme => ({
          '.fc-button': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            border: 'none !important',
            opacity: '1 !important'
          }
        })}
      />
      <FullCalendar plugins={[listPlugin]} locale={props.locale} initialView="listMonth" {...fullCalendarProps} />;
    </>
  );
};

export default DaysList;
