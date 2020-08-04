import React from 'react';
import { AutocompleteArrayInput, Edit, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { JsonLdReferenceInput, UriInput } from '@semapps/react-admin';

const ProjectEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" fullWidth />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <UriInput source="pair:homePage" label="Site web" fullWidth />
      <JsonLdReferenceInput label="Géré par" reference="Organization" source="pair:managedBy">
        <AutocompleteArrayInput
          optionText={record => {
            if (Array.isArray(record['pair:label'])) {
              return record['pair:label'][0];
            } else {
              return record['pair:label'] || 'Label manquant';
            }
          }}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Responsables" reference="User" source="pair:hasResponsible">
        <AutocompleteArrayInput
          optionText={record => (record ? `${record['pair:firstName']} ${record['pair:lastName']}` : 'Label manquant')}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Participants" reference="User" source="pair:involves">
        <AutocompleteArrayInput
          optionText={record => (record ? `${record['pair:firstName']} ${record['pair:lastName']}` : 'Label manquant')}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export default ProjectEdit;
