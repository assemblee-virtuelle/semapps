import React from 'react';
import { useRecordContext } from 'react-admin';
import CollectionList from './CollectionList';

const ReferenceCollectionField = ({ source, reference, children, ...rest }) => {
  const record = useRecordContext();

  if (React.Children.count(children) !== 1) {
    throw new Error('<ReferenceCollectionField> only accepts a single child');
  }

  if (!record || !record[source]) return null;

  return (
    <CollectionList resource={reference} collectionUrl={record[source]} {...rest}>
      {children}
    </CollectionList>
  );
};

export default ReferenceCollectionField;
