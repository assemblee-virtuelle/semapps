import React from 'react';
import { Datagrid, DateField, ReferenceField, TextField } from 'react-admin';
import ActivityDescription from './ActivityDescription';

const ActivitiesGrid = props => (
  <Datagrid {...props}>
    <DateField source="published" showTime label="Date" />
    <ReferenceField basePath="/Actor" reference="Actor" source="actor" label="Acteur">
      <TextField source="name" />
    </ReferenceField>
    <ActivityDescription label="Description" />
  </Datagrid>
);

export default ActivitiesGrid;
