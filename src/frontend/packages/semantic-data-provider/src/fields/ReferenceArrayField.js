import React from 'react';
import { ReferenceArrayField as RaReferenceArrayField } from 'react-admin';

const ReferenceArrayField = ({ record, source, ...otherProps }) => {
  if (record?.[source]) {
    if (!Array.isArray(record[source])) {
      record[source] = [record[source]];
    }
    record[source] = record[source].map(i => i['@id'] || i.id || i);
  }
  return <RaReferenceArrayField record={record} source={source} {...otherProps} />;
};

ReferenceArrayField.defaultProps = {
  addLabel: true
};

export default ReferenceArrayField;
