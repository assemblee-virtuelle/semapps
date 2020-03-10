import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  useAuthenticated
} from 'react-admin';
import Icon from '@material-ui/icons/Person';

export const PersonIcon = Icon;

export const PersonList = (props) => {
  useAuthenticated();
  return (
    <List title="Contributeurs" {...props}>
      <Datagrid>
        <TextField source="foaf:firstName" label="Prénom" />
        <TextField source="foaf:lastName" label="Nom de famille" />
        <EditButton basePath="/Person" />
      </Datagrid>
    </List>
  );
};
