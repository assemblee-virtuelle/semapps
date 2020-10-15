import React from 'react';
import { List, Datagrid, Edit, Create, SimpleForm, TextField, TextInput, AutocompleteArrayInput } from 'react-admin';
import Icon from '@material-ui/icons/Person';
import SearchFilter from '../components/SearchFilter';
import { JsonLdReferenceInput } from '@semapps/react-admin';

export const PersonIcon = Icon;

export const PersonList = props => {
  return (
    <List title="Contributeurs" perPage={25} filters={<SearchFilter />} {...props}>
      <Datagrid rowClick="edit">
        <TextField source="foaf:firstName" label="Prénom" />
        <TextField source="foaf:familyName" label="Nom de famille" />
      </Datagrid>
    </List>
  );
};

const PersonTitle = ({ record }) => {
  return <span>Personne {record ? `"${record['foaf:firstName'] || record['foaf:familyName']}"` : ''}</span>;
};

export const PersonEdit = props => (
  <Edit title={<PersonTitle />} {...props}>
    <SimpleForm>
      <TextInput source="foaf:firstName" label="Prénom" fullWidth />
      <TextInput source="foaf:familyName" label="Nom de famille" fullWidth />
      <JsonLdReferenceInput source="foaf:knows" label="Connait" reference="Person">
        <AutocompleteArrayInput
          optionText={record => `${record['foaf:firstName']} ${record['foaf:familyName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export const PersonCreate = props => (
  <Create title="Créer une personne" {...props}>
    <SimpleForm>
      <TextInput source="foaf:firstName" label="Prénom" fullWidth />
      <TextInput source="foaf:familyName" label="Nom de famille" fullWidth />
    </SimpleForm>
  </Create>
);
