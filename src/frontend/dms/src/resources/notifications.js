import React from 'react';
import { List, Datagrid, TextField, DateField, useAuthenticated, ReferenceField } from 'react-admin';
import Icon from '@material-ui/icons/Notifications';

export const NotificationIcon = Icon;

export const NotificationList = props => {
  useAuthenticated();
  return (
    <List title="Notifications" {...props}>
      <Datagrid>
        <DateField source="semapps:addedAt" label="Envoyée le" />
        <TextField source="semapps:status" label="Statut" />
        <TextField source="semapps:errorMessage" label="Message d'erreur" />
        <ReferenceField basePath="/Device" reference="Device" source="semapps:deviceId" label="Appareil">
          <TextField source="semapps:name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
};
