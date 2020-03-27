import { Datagrid, DateField, ReferenceField, TextField } from 'react-admin';
import ActivityDescription from './ActivityDescription';
import React from 'react';

const ActivitiesGrid = props => (
  <Datagrid {...props}>
    <DateField source="published" label="Date" />
    <ReferenceField basePath="/Actor" reference="Actor" source="actor" label="Acteur">
      <TextField source="as:name" />
    </ReferenceField>
    <ActivityDescription label="Description" />
    <TextField source="@type" label="Type d'activité " />
  </Datagrid>
);

export default ActivitiesGrid;
