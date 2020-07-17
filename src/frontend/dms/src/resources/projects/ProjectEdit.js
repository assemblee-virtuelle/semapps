import React from 'react';
import { AutocompleteArrayInput, Edit, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { JsonLdReferenceInput, UriInput } from '@semapps/react-admin';

const ProjectEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" fullWidth />
      <TextInput source="pairv1:comment" label="Commentaire" fullWidth />
      <MarkdownInput multiline source="pairv1:description" label="Description" fullWidth />
      <UriInput source="pairv1:homePage" label="Site web" fullWidth />
      <UriInput source="pairv1:image" label="Image" fullWidth />
      <TextInput source="pairv1:adress" label="Adresse" fullWidth />
      <JsonLdReferenceInput label="Géré par" reference="Agent" source="pairv1:isManagedBy">
        <AutocompleteArrayInput
          optionText={record => {
            // TODO improve the handling of the many possible cases
            if (!record) return 'Label manquant';
            if (record['rdf:type'] === 'pairv1:Organization' || record['@type'] === 'pairv1:Organization') {
              if (Array.isArray(record['pairv1:preferedLabel'])) {
                return record['pairv1:preferedLabel'][0];
              } else {
                return record['pairv1:preferedLabel'] || 'Label manquant';
              }
            }
            return `${record['foaf:givenName']} ${record['foaf:familyName']}` || 'Label manquant';
          }}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Intérêts" reference="Concept" source="pairv1:hasInterest">
        <AutocompleteArrayInput
          optionText={record => (record && record['skos:prefLabel']['@value']) || 'LABEL MANQUANT'}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export default ProjectEdit;
