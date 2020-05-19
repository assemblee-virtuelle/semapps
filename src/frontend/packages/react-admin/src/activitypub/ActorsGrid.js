import React from 'react';
import { Datagrid, ShowButton, TextField } from 'react-admin';

const ActorsGrid = props => (
  <Datagrid rowClick="show" {...props}>
    <TextField source="name" label="Nom" />
    <ShowButton basePath="/Actor" />
  </Datagrid>
);

export default ActorsGrid;
