import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ActorsInput, DocumentsInput } from '../../inputs';

const ProjectEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" label="Nom" fullWidth />
      <TextInput source="pair:comment" label="Courte description" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <TextInput source="pair:homePage" label="Site web" fullWidth />
      <ActorsInput label="Participe" source="pair:involves" />
      <DocumentsInput label="Documents" source="pair:documentedBy" />
    </SimpleForm>
  </Edit>
);

export default ProjectEdit;
