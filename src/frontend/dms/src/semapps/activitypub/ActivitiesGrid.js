import { Datagrid, DateField, ReferenceField, TextField } from 'react-admin';
import ActivityDescription from './ActivityDescription';
import React from 'react';

const ActivitiesGrid = props => (
  <Datagrid {...props}>
    <DateField source="published" showTime label="Date" />
    <ReferenceField basePath="/Actor" reference="Actor" source="actor" label="Acteur">
      <TextField source="as:name" />
    </ReferenceField>
    <ActivityDescription label="Description" />
  </Datagrid>
);

export default ActivitiesGrid;
