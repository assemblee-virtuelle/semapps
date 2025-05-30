import React from 'react';
import { ReferenceArrayField as RaReferenceArrayField, useRecordContext, RecordContextProvider } from 'react-admin';

const ReferenceArrayField = ({ source, ...otherProps }) => {
  const record = useRecordContext();
  if (record?.[source]) {
    if (!Array.isArray(record[source])) {
      record[source] = [record[source]];
    }
    record[source] = record[source].map(i => i['@id'] || i.id || i);
  }
  return (
    <RecordContextProvider value={record}>
      <RaReferenceArrayField source={source} {...otherProps} />
    </RecordContextProvider>
  );
};

export default ReferenceArrayField;
