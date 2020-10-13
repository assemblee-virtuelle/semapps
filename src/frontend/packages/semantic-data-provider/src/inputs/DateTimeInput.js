import React from 'react';
import { DateTimeInput as RaDateTimeInput } from 'react-admin';

const DateTimeInput = props => (
  <RaDateTimeInput {...props} format={value => value && value.replace(' ', 'T').replace('Z', '')} />
);

export default DateTimeInput;
