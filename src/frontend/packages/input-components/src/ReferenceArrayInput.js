import React from 'react';
import { ReferenceArrayInput as RaReferenceArrayInput, useResourceContext, useRecordContext } from 'react-admin';

const ReferenceArrayInput = props => {
  const resource = useResourceContext({});
  let record = useRecordContext();
  if (record && record[props.source]) {
    let value = record[props.source];
    // if the linked field value is not an array, turns it into an array.
    // Necessary as JSON-LD are sometimes arrays, sometimes not (when there is one value)
    // and the ReferenceArrayInput component only accept arrays
    if (!Array.isArray(value)) value = [value];
    // If a format prop was defined, apply it to the array
    if (props.format) value = props.format(value);
    // If the values are objects with @id field, turn it to a simple string
    value = value.map(v => (typeof v === 'object' ? v.id || v['@id'] : v));
    record[props.source] = value;
  }
  return (
    <RaReferenceArrayInput
      {...props}
      resource={resource}
      record={record}
    />
  );
};

export default ReferenceArrayInput;