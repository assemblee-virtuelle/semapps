import React from 'react';
import { ImageField as RaImageField } from 'react-admin';

const ImageField = ({ record, source, ...otherProps }) => {
  // For the display, we need to have the URI in a src property
  if (typeof record === 'string') record = { [source]: record };
  return <RaImageField record={record} source={source} {...otherProps} />;
};

export default ImageField;
