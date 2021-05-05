import React from 'react';
import { DateTimeInput as RaDateTimeInput } from 'react-admin';

/**
 * @deprecated Use the component from the @semapps/date-components instead
 */
const DateTimeInput = props => (
  <RaDateTimeInput {...props} format={value => value && value.replace(' ', 'T').replace('Z', '')} />
);

export default DateTimeInput;
