import React from 'react';
import { DatePicker, DateRangePicker, DateTimePicker, TimePicker } from '@material-ui/pickers';
import RangePicker from './RangePicker';
import Picker from './Picker';

export const DateInput = props => <Picker Component={DatePicker} {...props} />;
export const TimeInput = props => <Picker Component={TimePicker} {...props} />;
export const DateTimeInput = props => <Picker Component={DateTimePicker} {...props} />;
export const DateRangeInput = props => <RangePicker Component={DateRangePicker} {...props} />;
