import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { UriInput } from '@semapps/react-admin';

const ProjectCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Nom" fullWidth />
      <MarkdownInput multiline source="pair:description" label="Description" fullWidth />
      <UriInput source="pair:homePage" label="Site web" fullWidth />
    </SimpleForm>
  </Create>
);

export default ProjectCreate;
