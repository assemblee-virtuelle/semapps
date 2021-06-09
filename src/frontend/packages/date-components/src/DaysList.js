import React from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import useFullCalendarProps from './useFullCalendarProps';

const DaysList = props => {
  const fullCalendarProps = useFullCalendarProps(props);
  return <FullCalendar plugins={[listPlugin]} locale={props.locale} initialView="listMonth" {...fullCalendarProps} />;
};

DaysList.defaultProps = {
  linkType: 'edit'
};

export default DaysList;
