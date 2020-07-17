import React from 'react';
import { ReferenceArrayField } from 'react-admin';

const JsonLdReferenceArrayField = ({ record, source, ...otherProps }) => {
  if (Array.isArray(record[source])) {
    record[source] = record[source].map(i => i['@id'] || i);
  }
  return <ReferenceArrayField record={record} source={source} {...otherProps} />;
};

export default JsonLdReferenceArrayField;
