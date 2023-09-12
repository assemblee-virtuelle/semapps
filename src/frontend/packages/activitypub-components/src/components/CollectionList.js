import React from 'react';
import { useGetOne, LinearProgress } from 'react-admin';
import { ReferenceArrayField } from '@semapps/field-components';

const CollectionList = ({ collectionUrl, resource, children, ...rest }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<CollectionList> only accepts a single child');
  }

  // TODO use a simple fetch call, as the resource is not good and it is useless
  const { data: collection, isLoading } = useGetOne(resource, collectionUrl, { enabled: !!collectionUrl });

  if (isLoading) {
    return (
      <div style={{ marginTop: 8 }}>
        <LinearProgress />
      </div>
    );
  }
  if (!collection) {
    return null;
  }

  return (
    <ReferenceArrayField reference={resource} record={collection} source="items" {...rest}>
      {children}
    </ReferenceArrayField>
  );
};

export default CollectionList;
