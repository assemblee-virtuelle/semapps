import React from 'react';
import { AutocompleteArrayInput, Edit, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { JsonLdReferenceInput, UriInput } from '@semapps/react-admin';

const OrganizationTitle = ({ record }) => {
  return <span>Organisation {record ? `"${record['label']}"` : ''}</span>;
};

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <UriInput source="pair:homePage" label="Site web" fullWidth />
      <JsonLdReferenceInput label="Membres" reference="User" source="pair:hasMember">
        <AutocompleteArrayInput
          optionText={record => record && `${record['pair:firstName']} ${record['pair:lastName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
