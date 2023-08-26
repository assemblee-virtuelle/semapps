import React from 'react';
import CollectionList from './CollectionList';

const ReferenceCollectionField = ({ source, record, reference, children, ...rest }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<ReferenceCollectionField> only accepts a single child');
  }

  if (!record?.[source]) return null;

  return (
    <CollectionList resource={reference} collectionUrl={record[source]} {...rest}>
      {children}
    </CollectionList>
  );
};

export default ReferenceCollectionField;
