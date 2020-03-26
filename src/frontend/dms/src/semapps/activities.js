import React from 'react';
import {
  DateField,
  TextField,
  useQueryWithStore,
  useReference,
  LinearProgress,
  ReferenceField,
  getResourceLinkPath,
  Link
} from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import FollowIcon from '@material-ui/icons/PersonAdd';
import CreateIcon from '@material-ui/icons/Add';

const cardStyle = {
  marginBottom: '1.5em',
  verticalAlign: 'top',
  backgroundColor: '#EEEEEE'
};

const FollowDescription = ({ activity }) => {
  const { referenceRecord: object } = useReference({
    reference: 'pair-Project',
    id: activity.object
  });

  // TODO calculate the basePath depending on the object @type
  const resourceLinkPath = getResourceLinkPath({ record: activity, source: 'object', basePath: '/pair-Project' });

  if (!object) {
    return <LinearProgress />;
  } else {
    return (
      <span>
        A suivi l'action <Link to={resourceLinkPath}>{object['as:name']}</Link>
      </span>
    );
  }
};

const CreateDescription = ({ activity }) => {
  const { referenceRecord: object } = useReference({
    reference: 'as-Note',
    id: activity.object['@id']
  });

  // TODO calculate the basePath depending on the object @type
  const resourceLinkPath = getResourceLinkPath({ record: activity.object, source: '@id', basePath: '/as-Note' });

  if (!object) {
    return <LinearProgress />;
  } else {
    return (
      <span>
        A posté l'actualité <Link to={resourceLinkPath}>{object['as:name']}</Link>
      </span>
    );
  }
};

export const ActivitiesGrid = ({ ids, data, basePath }) => (
  <div style={{ margin: '0.5em', marginTop: '1em' }}>
    {ids.map(id => (
      <Card key={id} style={cardStyle}>
        <CardHeader
          title={
            <ReferenceField basePath="/as-Person" record={data[id]} reference="as-Person" source="actor">
              <TextField source="as:name" />
            </ReferenceField>
          }
          subheader={<DateField record={data[id]} source="published" />}
          avatar={
            <Avatar>
              {data[id]['@type'] === 'Follow' && <FollowIcon />}
              {data[id]['@type'] === 'Create' && <CreateIcon />}
            </Avatar>
          }
        />
        <CardContent>
          {data[id]['@type'] === 'Follow' && <FollowDescription activity={data[id]} />}
          {data[id]['@type'] === 'Create' && <CreateDescription activity={data[id]} />}
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ActivitiesList = ({ children, source, record = {} }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<ActivitiesList> only accepts a single child');
  }

  const { data } = useQueryWithStore({
    type: 'getList',
    resource: 'as-Activity',
    payload: { id: record[source]['@id'] }
  });

  if (!data) return null;

  return React.cloneElement(children, {
    data: data.reduce((o, activity) => ({ ...o, [activity.id]: activity }), {}),
    ids: data.map(activity => activity.id),
    basePath: '/as-Activity'
  });
};
