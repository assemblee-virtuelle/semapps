import React from 'react';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import Picker from './Picker';

const DateInput = props => <Picker PickerComponent={DatePicker} {...props} />;
const TimeInput = props => <Picker PickerComponent={TimePicker} {...props} />;
const DateTimeInput = props => <Picker PickerComponent={DateTimePicker} {...props} />;
const KeyboardDateInput = props => <Picker PickerComponent={KeyboardDatePicker} {...props} />;
const KeyboardDateTimeInput = props => <Picker PickerComponent={KeyboardDateTimePicker} {...props} />;
const KeyboardTimeInput = props => <Picker PickerComponent={KeyboardTimePicker} {...props} />;

export { DateInput, TimeInput, DateTimeInput, KeyboardDateInput, KeyboardDateTimeInput, KeyboardTimeInput };

export { default as CalendarList } from './CalendarList';
export { default as DaysList } from './DaysList';
export { default as useFullCalendarProps } from './useFullCalendarProps';
