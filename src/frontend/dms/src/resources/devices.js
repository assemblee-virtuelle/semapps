import React from 'react';
import { List, Datagrid, TextField, DateField, useAuthenticated, ReferenceField } from 'react-admin';
import Icon from '@material-ui/icons/PhonelinkRing';

export const DeviceIcon = Icon;

export const DeviceList = props => {
  useAuthenticated();
  return (
    <List title="Appareils" {...props}>
      <Datagrid>
        <DateField source="semapps:addedAt" label="Ajouté le" />
        <ReferenceField basePath="/Actor" reference="Actor" source="semapps:ownedBy" label="Utilisateur">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="semapps:name" label="Modèle" />
        <TextField source="semapps:yearClass" label="Année de référence" />
        <TextField source="semapps:errorMessage" label="Message d'erreur" />
      </Datagrid>
    </List>
  );
};
