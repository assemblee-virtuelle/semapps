import React from 'react';
import { ReferenceInput as RaReferenceInput, useResourceContext } from 'react-admin';

const ReferenceInput = props => {
  const resource = useResourceContext({});
  return (
    <RaReferenceInput
      {...props}
      resource={resource}
      format={value => {
        // If there is no value, return immediately
        if (!value) return value;
        // If a format prop was defined, apply it
        if (props.format) value = props.format(value);
        // If the value is an object with an @id field, return the uri
        return typeof value === 'object' ? value.id || value['@id'] : value;
      }}
    />
  );
};

export default ReferenceInput;
