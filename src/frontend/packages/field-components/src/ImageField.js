import React from 'react';
import { ImageField as RaImageField, useRecordContext, RecordContextProvider } from 'react-admin';

const ImageField = ({ source, ...otherProps }) => {
  const record = useRecordContext();
  // For the display, we need to have the URI in a src property
  return (
    <RecordContextProvider value={typeof record === 'string' ? { [source]: record } : record}>
      <RaImageField source={source} {...otherProps} />
    </RecordContextProvider>
  );
};

export default ImageField;
