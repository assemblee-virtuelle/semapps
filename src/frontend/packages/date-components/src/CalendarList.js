import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useTheme } from '@material-ui/core';
import useFullCalendarProps from "./useFullCalendarProps";

const CalendarList = (props) => {
  const theme = useTheme();
  const fullCalendarProps = useFullCalendarProps(props);
  return(
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      locale={props.locale}
      initialView='dayGridMonth'
      eventBackgroundColor={theme.palette.primary.main}
      {...fullCalendarProps}
    />
  );
};

CalendarList.defaultProps = {
  linkType: 'edit'
};

export default CalendarList;
