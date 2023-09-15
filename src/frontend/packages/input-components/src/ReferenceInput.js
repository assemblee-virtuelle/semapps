import React from 'react';
import { ReferenceInput as RaReferenceInput } from 'react-admin';

const format = value => {
  // If there is no value, return immediately
  if (!value) return value;
  // If the value is an object with an @id field, return the uri
  return typeof value === 'object' ? value.id || value['@id'] : value;
};

const ReferenceInput = ({ children, ...rest }) => {
  const child = React.Children.only(children);
  return <RaReferenceInput {...rest}>{React.cloneElement(child, { format })}</RaReferenceInput>;
};

export default ReferenceInput;
