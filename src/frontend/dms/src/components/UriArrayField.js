import React from 'react';
import { ReferenceArrayField } from 'react-admin';

// We cannot use basePath because it is overwritten by the parent component during the cloning
// TODO see if we could fix or adapt the ReferenceArrayField component so that we can pass a basePath
const UriArrayField = ({ record, source, referenceBasePath, basePath, ...otherProps }) => {
  if (record[source]) {
    if (Array.isArray(record[source])) {
      console.log('record[source]', record[source]);
      record[source] = record[source].map(i => i['@id'] || i);
    } else {
      record[source] = [record[source]];
    }
  }
  return (
    <ReferenceArrayField record={record} source={source} basePath={referenceBasePath || basePath} {...otherProps} />
  );
};

UriArrayField.defaultProps = {
  addLabel: true
};

export default UriArrayField;
