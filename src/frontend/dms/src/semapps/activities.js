import React from "react";
import {DateField, ReferenceField, TextField, useQueryWithStore} from "react-admin";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import FollowIcon from '@material-ui/icons/PersonAdd';

const cardStyle = {
  marginBottom: '1.5em',
  verticalAlign: 'top',
  backgroundColor: '#EEEEEE'
};

export const ActivitiesGrid = ({ ids, data, basePath }) => (
  <div style={{ margin: '0.5em', marginTop: '1em' }}>
    {ids.map(id =>
      <Card key={id} style={cardStyle}>
        <CardHeader
          title={<TextField record={data[id]} source="@type" />}
          subheader={<DateField record={data[id]} source="published" />}
          avatar={<Avatar><FollowIcon /></Avatar>}/>
        <CardContent>
          Anna Elisa suit maintenant "Créer un cercle actif"
          <ReferenceField basePath={basePath} record={data[id]} reference="as-Person" source="object">
            <TextField source="as:name" />
          </ReferenceField>
        </CardContent>
      </Card>
    )}
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

  if( !data ) return null;

  return React.cloneElement(children, {
    data: data.reduce((o, activity) => ({...o, [activity.id]: activity}), {}),
    ids: data.map(activity => activity.id),
    basePath: '/as-Activity'
  });
};