import React from 'react';
import { useQueryWithStore } from 'react-admin';

const ActivitiesList = ({ children, source, record = {} }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<ActivitiesList> only accepts a single child');
  }

  const { data } = useQueryWithStore({
    type: 'getList',
    resource: 'Activity',
    payload: { id: record[source]['@id'] }
  });

  if (!data) return null;

  const activities = data.reduce((o, activity) => ({ ...o, [activity.id]: activity }), {});

  return React.cloneElement(children, {
    resource: 'Activity',
    currentSort: { field: 'id', order: 'ASC' },
    data: activities,
    ids: Object.keys(activities),
    basePath: '/Activity'
  });
};

export default ActivitiesList;
