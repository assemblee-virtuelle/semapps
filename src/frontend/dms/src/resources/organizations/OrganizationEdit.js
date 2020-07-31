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
      <TextInput source="label" label="Nom" />
      <TextInput source="comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="description" label="Description" fullWidth />
      <UriInput source="homePage" label="Site web" fullWidth />
      <JsonLdReferenceInput label="Membres" reference="User" source="hasMember">
        <AutocompleteArrayInput
          optionText={record => record && `${record.firstName} ${record.lastName}`}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
