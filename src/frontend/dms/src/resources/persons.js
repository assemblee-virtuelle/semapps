import React from 'react';
import { List, Datagrid, TextField, useAuthenticated } from 'react-admin';
import Icon from '@material-ui/icons/Person';
import SearchFilter from "../components/SearchFilter";

export const PersonIcon = Icon;

export const PersonList = props => {
  useAuthenticated();
  return (
    <List title="Contributeurs"  perPage={25} filters={<SearchFilter />} {...props}>
      <Datagrid>
        <TextField source="foaf:firstName" label="Prénom" />
        <TextField source="foaf:lastName" label="Nom de famille" />
      </Datagrid>
    </List>
  );
};
