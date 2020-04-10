import React from 'react';
import { ReferenceArrayInput, TextInput, DateTimeInput as RaDateTimeInput } from 'react-admin';

const selectValue = value => {
  if (typeof value === 'object' && value['@value']) {
    return value['@value'];
  } else {
    return value;
  }
};

export const JsonLdReferenceInput = props => (
  <ReferenceArrayInput
    {...props}
    format={value => {
      // If there is no value, return immediately
      if (!value) return value;
      // if the linked field value is not an array, turns it into an array.
      // Necessary as JSON-LD are sometimes arrays, sometimes not (when there is one value)
      // and the ReferenceArrayInput component only accept arrays
      if (!Array.isArray(value)) value = [value];
      // If a format prop was defined, apply it to the array
      if (props.format) value = props.format(value);
      // If the values are objects with @id field, turn it to a simple string
      return value.map(v => (typeof v === 'object' ? (v.id || v['@id']) : v));
    }}
  />
);

export const UriInput = props => (
  <TextInput
    {...props}
    format={value => {
      // If the value has the format { @id: ... }, convert it to a string
      if (typeof value === 'object') value = value['@id'];
      // If a format prop was defined, apply it to the string
      if (props.format) value = props.format(value);
      return value;
    }}
  />
);

export const DateTimeInput = props => (
  <RaDateTimeInput {...props} format={value => {
    value = selectValue(value);
    if( value ) return value.replace(' ', 'T')
  }} />
);

export const DateField = props => {
  return <span>{selectValue(props.record[props.source]).replace('T', ' ')}</span>;
};

export const StringField = ({ source, record = {} }) => <span>{selectValue(record[source])}</span>;
