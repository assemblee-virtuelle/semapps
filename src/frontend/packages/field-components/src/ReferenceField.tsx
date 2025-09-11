import React from 'react';
import { ReferenceField as RaReferenceField, useRecordContext, RecordContextProvider } from 'react-admin';

const ReferenceField = ({
  source,
  ...otherProps
}: any) => {
  const record = useRecordContext();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  if (record[source]) {
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    if (typeof record[source] === 'object') {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
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
