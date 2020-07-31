import React from "react";
import {Datagrid, EditButton, List, TextField} from "react-admin";
import SearchFilter from "../../components/SearchFilter";

export const OrganizationList = props => (
  <List title="Organisations" perPage={25} filters={<SearchFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="pair:label" label="Nom" />
      <EditButton basePath="/organizations" />
    </Datagrid>
  </List>
);

export default OrganizationList;
