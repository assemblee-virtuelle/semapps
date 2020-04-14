import { Datagrid, ShowButton, TextField } from 'react-admin';
import React from 'react';

const ActorsGrid = props => (
  <Datagrid rowClick="show" {...props}>
    <TextField source="name" label="Nom" />
    <ShowButton basePath="/Actor" />
  </Datagrid>
);

export default ActorsGrid;
