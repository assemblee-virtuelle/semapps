import React from 'react';
import { useList, ListContextProvider, useGetMany } from 'react-admin';
import useCollection from '../hooks/useCollection';

const CollectionList = ({
  collectionUrl,
  resource,
  children
}: any) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<CollectionList> only accepts a single child');
  }

  const { items: actorsUris } = useCollection(collectionUrl);

  const { data, isLoading, isFetching } = useGetMany(
    resource,
    { ids: Array.isArray(actorsUris) ? actorsUris : [actorsUris] },
    { enabled: !!actorsUris }
  );

  const listContext = useList({ data, isLoading, isFetching });

  return <ListContextProvider value={listContext}>{children}</ListContextProvider>;
};

export default CollectionList;
