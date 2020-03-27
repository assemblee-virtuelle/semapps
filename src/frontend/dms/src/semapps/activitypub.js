import React from 'react';
import { useQueryWithStore, useReference, LinearProgress, Link } from 'react-admin';

const parseDescriptionFromActivity = activity => {
  switch (activity['@type']) {
    case 'Create':
      return {
        description: "A posté l'actualité",
        reference: { resource: 'Note', id: activity.object['@id'], source: 'as:name', basePath: '/Note' }
      };
    case 'Follow':
      return {
        description: "A suivi l'action",
        reference: { resource: 'Project', id: activity.object, source: 'as:name', basePath: '/Project' }
      };
    default:
      return {
        description: "Type d'action inconnu"
      };
  }
};

const ActivityDescriptionReference = ({ resource, id, source, basePath }) => {
  const { referenceRecord } = useReference({ reference: resource, id });
  if (!referenceRecord) {
    return <LinearProgress />;
  } else {
    return <Link to={`${basePath}/${encodeURIComponent(id)}`}>{referenceRecord[source]}</Link>;
  }
};

export const ActivityDescription = ({ record }) => {
  const { description, reference } = parseDescriptionFromActivity(record);
  return (
    <span>
      {description}
      &nbsp;
      {reference && <ActivityDescriptionReference {...reference} />}
    </span>
  );
};

export const ActivitiesList = ({ children, source, record = {} }) => {
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
