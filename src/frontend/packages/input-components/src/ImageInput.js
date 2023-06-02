import React from 'react';
import { ImageInput as RaImageInput } from 'react-admin';

const ImageInput = ({ source, ...rest }) => {
  const record = useRecordContext();
  const modifiedRecord = record[source] && typeof record[source] === 'string' 
    ? { ...record, [source]: { src: record[source] } }
    : record;

  return (
    <RecordContextProvider value={modifiedRecord}>
      <RaImageInput source={source} {...rest} />
    </RecordContextProvider>
  );
};

export default ImageInput;
