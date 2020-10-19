import React from 'react';
import { List, Datagrid, TextField, EditButton, SingleFieldList, ChipField } from 'react-admin';
import { UriArrayField } from '@semapps/semantic-data-provider';
import SearchFilter from '../../components/SearchFilter';

const ProjectList = props => (
  <List title="Projets La Fabrique" perPage={25} filters={<SearchFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="pair:label" label="Nom" />
      <UriArrayField reference="Theme" source="pair:interestOf" label="Tags">
        <SingleFieldList>
          <ChipField source="pair:preferedLabel" />
        </SingleFieldList>
      </UriArrayField>
      <EditButton basePath="/Project" />
    </Datagrid>
  </List>
);

export default ProjectList;
