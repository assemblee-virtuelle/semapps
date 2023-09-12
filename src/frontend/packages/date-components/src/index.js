import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Picker from './Picker';

const DateInput = (props) => <Picker PickerComponent={DatePicker} {...props} />;
const TimeInput = (props) => <Picker PickerComponent={TimePicker} {...props} />;
const DateTimeInput = (props) => <Picker PickerComponent={DateTimePicker} {...props} />;

export { DateInput, TimeInput, DateTimeInput };

export { default as CalendarList } from './CalendarList';
export { default as DaysList } from './DaysList';
export { default as useFullCalendarProps } from './useFullCalendarProps';
