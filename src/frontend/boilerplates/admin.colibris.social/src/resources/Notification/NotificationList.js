import React from 'react';
import { List, Datagrid, TextField, DateField, ReferenceField } from 'react-admin';

const NotificationList = props => (
  <List title="Notifications" perPage={25} {...props}>
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

export default NotificationList;
