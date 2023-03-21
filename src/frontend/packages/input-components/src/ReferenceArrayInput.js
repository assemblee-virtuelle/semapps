import React from 'react';
import { ReferenceArrayInput as RaReferenceArrayInput, useResourceContext } from 'react-admin';

const ReferenceArrayInput = props => {
  const resource = useResourceContext({});
  return (
    <RaReferenceArrayInput
      {...props}
      resource={resource}
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
        return value.map(v => (typeof v === 'object' ? v.id || v['@id'] : v));
      }}
    />
  );
};

export default ReferenceArrayInput;
