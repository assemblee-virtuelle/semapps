import React from 'react';
import { ReferenceArrayField } from 'react-admin';

const UriArrayField = ({ record, source, ...otherProps }) => {
  if (record[source]) {
    if (Array.isArray(record[source])) {
      record[source] = record[source].map(i => i['@id'] || i);
    } else {
      record[source] = [record[source]];
    }
  }
  return <ReferenceArrayField record={record} source={source} {...otherProps} />;
};

UriArrayField.defaultProps = {
  addLabel: true
};

export default UriArrayField;
