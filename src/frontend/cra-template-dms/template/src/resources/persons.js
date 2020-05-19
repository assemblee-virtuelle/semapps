import React from 'react';
import { List, Datagrid, TextField } from 'react-admin';
import Icon from '@material-ui/icons/Person';
import SearchFilter from '../components/SearchFilter';

export const PersonIcon = Icon;

export const PersonList = props => {
  return (
    <List title="Contributeurs" perPage={25} filters={<SearchFilter />} {...props}>
      <Datagrid>
        <TextField source="foaf:firstName" label="Prénom" />
        <TextField source="foaf:familyName" label="Nom de famille" />
      </Datagrid>
    </List>
  );
};
