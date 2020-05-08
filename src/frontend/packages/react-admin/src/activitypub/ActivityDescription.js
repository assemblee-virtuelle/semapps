import React from 'react';
import { useReference, LinearProgress, Link } from 'react-admin';

const parseDescriptionFromActivity = activity => {
  switch (activity.type) {
    case 'Create':
      return {
        description: "A posté l'actualité",
        reference: { resource: 'Note', id: activity.object.id, value: activity.object.name, basePath: '/Note' }
      };
    case 'Update':
      return {
        description: "A mis à jour l'actualité",
        reference: { resource: 'Note', id: activity.object.id, value: activity.object.name, basePath: '/Note' }
      };
    case 'Delete':
      return {
        description: "A effacé un objet"
      };
    case 'Follow':
      return {
        description: "A suivi l'action",
        reference: { resource: 'Project', id: activity.object, source: 'name', basePath: '/Project' }
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

const ActivityDescription = ({ record }) => {
  const { description, reference } = parseDescriptionFromActivity(record);
  return (
    <span>
      {description}
      &nbsp;
      {reference ? reference.value ? (
        <Link to={`${reference.basePath}/${encodeURIComponent(reference.id)}`}>{reference.value}</Link>
      ) : (
        <ActivityDescriptionReference {...reference} />
      ) : null}
    </span>
  );
};

export default ActivityDescription;
