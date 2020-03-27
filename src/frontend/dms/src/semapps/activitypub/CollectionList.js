import React from 'react';
import { useQueryWithStore, useGetMany } from 'react-admin';

const ActorsList = ({ ids, children }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<ActorsList> only accepts a single child');
  }

  const { data } = useGetMany('Actor', ids);

  const actors = data.filter(actor => actor).reduce((o, actor) => ({ ...o, [actor.id]: actor }), {});

  return React.cloneElement(children, {
    resource: 'Actor',
    currentSort: { field: 'id', order: 'ASC' },
    data: actors,
    ids: Object.keys(actors),
    basePath: '/Actor'
  });
};

const CollectionList = ({ children, source, record }) => {
  const { data } = useQueryWithStore({
    type: 'getOne',
    resource: 'Collection',
    payload: { id: record[source]['@id'] }
  });

  return data && data.items.length > 0 ? <ActorsList ids={data.items}>{children}</ActorsList> : null;
};

export default CollectionList;
