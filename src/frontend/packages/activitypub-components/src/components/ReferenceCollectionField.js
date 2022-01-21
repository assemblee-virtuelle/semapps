import React from 'react';
import CollectionList from './CollectionList';

const ReferenceCollectionField = ({ source, record, reference, children, ...rest }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<ReferenceCollectionField> only accepts a single child');
  }

  if (!record || !record[source]) return null;

  return (
    <CollectionList resource={reference} collectionUri={record[source]} {...rest}>
      {children}
    </CollectionList>
  );
};

ReferenceCollectionField.defaultProps = {
  addLabel: true
};

export default ReferenceCollectionField;
