/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-props-no-spreading */

// Solves bug with Vite in dev mode. Can be removed when we upgrade to FullCalendar v6
// See https://github.com/fullcalendar/fullcalendar-vue/issues/152
import '@fullcalendar/core/vdom';

import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import Picker, { Props as PickerProps } from './Picker';

const DateInput = <TDate,>(props: Omit<PickerProps<DatePickerProps<TDate>>, 'PickerComponent'>) => (
  <Picker PickerComponent={DatePicker} {...props} />
);
const TimeInput = <TDate,>(props: Omit<PickerProps<TimePickerProps<TDate>>, 'PickerComponent'>) => (
  <Picker PickerComponent={TimePicker} {...props} />
);
const DateTimeInput = <TDate,>(props: Omit<PickerProps<DateTimePickerProps<TDate>>, 'PickerComponent'>) => (
  <Picker PickerComponent={DateTimePicker} {...props} />
);

export { DateInput, TimeInput, DateTimeInput };

export { default as CalendarList } from './CalendarList';
export { default as DaysList } from './DaysList';
export { default as useFullCalendarProps } from './useFullCalendarProps';
