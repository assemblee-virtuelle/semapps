import React from 'react';
import { Datagrid, EditButton, List, ShowButton, TextField } from 'react-admin';
import SearchFilter from '../../components/SearchFilter';

const ProjectList = props => {
  return (
    <List perPage={25} filters={<SearchFilter />} {...props}>
      <Datagrid rowClick="show">
        <TextField source="pairv1:preferedLabel" label="Nom" />
        <ShowButton basePath="/projects" />
        <EditButton basePath="/projects" />
      </Datagrid>
    </List>
  );
};

export default ProjectList;
