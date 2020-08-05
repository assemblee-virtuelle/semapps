import React from 'react';
import { ReferenceArrayField } from 'react-admin';

// We cannot use basePath because it is overwritten by the parent component during the cloning
const UriArrayField = ({ record, source, ...otherProps }) => {
  if (record[source]) {
    if (Array.isArray(record[source])) {
      record[source] = record[source].map(i => i['@id'] || i);
    } else {
      record[source] = [record[source]];
    }
  }
  return (
    <ReferenceArrayField record={record} source={source} {...otherProps} />
  );
};

UriArrayField.defaultProps = {
  addLabel: true
};

export default UriArrayField;
