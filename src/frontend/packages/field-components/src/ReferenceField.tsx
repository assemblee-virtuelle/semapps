import React from 'react';
import { ReferenceField as RaReferenceField, useRecordContext, RecordContextProvider } from 'react-admin';

const ReferenceField = ({ source, ...otherProps }) => {
  const record = useRecordContext();
  if (record[source]) {
    if (typeof record[source] === 'object') {
      record[source] = record[source]['@id'] || record[source].id;
    }
  }
  return (
    <RecordContextProvider value={record}>
      <RaReferenceField record={record} source={source} {...otherProps} />
    </RecordContextProvider>
  );
};

export default ReferenceField;
