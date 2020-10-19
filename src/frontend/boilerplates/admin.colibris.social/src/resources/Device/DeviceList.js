import React from 'react';
import { List, Datagrid, TextField, DateField, ReferenceField } from 'react-admin';

const DeviceList = props => (
  <List title="Appareils" perPage={25} {...props}>
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

export default DeviceList;
