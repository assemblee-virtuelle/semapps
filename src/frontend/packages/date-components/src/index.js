import React from 'react';
import Picker from './Picker';
import { 
  DatePicker,
  DateTimePicker,
  TimePicker
 } from '@mui/lab';

const DateInput = props => <Picker PickerComponent={DatePicker} {...props} />;
const TimeInput = props => <Picker PickerComponent={TimePicker} {...props} />;
const DateTimeInput = props => <Picker PickerComponent={DateTimePicker} {...props} />;
const KeyboardDateInput = props => <Picker PickerComponent={DatePicker} {...props} />;
const KeyboardDateTimeInput = props => <Picker PickerComponent={DateTimePicker} {...props} />;
const KeyboardTimeInput = props => <Picker PickerComponent={TimePicker} {...props} />;

export { DateInput, TimeInput, DateTimeInput, KeyboardDateInput, KeyboardDateTimeInput, KeyboardTimeInput };

export { default as CalendarList } from './CalendarList';
export { default as DaysList } from './DaysList';
export { default as useFullCalendarProps } from './useFullCalendarProps';
