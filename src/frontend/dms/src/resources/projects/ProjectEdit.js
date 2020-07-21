import React from 'react';
import { AutocompleteArrayInput, Edit, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { JsonLdReferenceInput, UriInput } from '@semapps/react-admin';

const ProjectEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="label" label="Nom" fullWidth />
      <TextInput source="comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="description" label="Description" fullWidth />
      <UriInput source="homePage" label="Site web" fullWidth />
      <JsonLdReferenceInput label="Géré par" reference="Organization" source="managedBy">
        <AutocompleteArrayInput
          optionText={record => {
            // TODO improve the handling of the many possible cases
            if (!record) return 'Label manquant';
            if (record['rdf:type'] === 'Organization' || record['@type'] === 'Organization') {
              if (Array.isArray(record.label)) {
                return record.label[0];
              } else {
                return record.label || 'Label manquant';
              }
            }
            return `${record['foaf:givenName']} ${record['foaf:familyName']}` || 'Label manquant';
          }}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Participants" reference="Agent" source="involves">
        <AutocompleteArrayInput
          optionText={record => (record ? `${record.firstName} ${record.lastName}` : 'Label manquant')}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export default ProjectEdit;
