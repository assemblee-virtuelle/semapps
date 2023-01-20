import React from 'react';
import { ReferenceField as RaReferenceField } from 'react-admin';

const ReferenceField = ({ record, source, ...otherProps }) => {
  if (record[source]) {
    if (typeof record[source] === 'object') {
      record[source] = record[source]['@id'] || record[source].id;
    }
  }
  return <RaReferenceField record={record} source={source} {...otherProps} />;
};

export default ReferenceField;
