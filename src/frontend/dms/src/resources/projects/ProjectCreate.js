import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { UriInput } from '@semapps/react-admin';

const ProjectCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="label" label="Nom" fullWidth />
      <MarkdownInput multiline source="description" label="Description" fullWidth />
      <UriInput source="homePage" label="Site web" fullWidth />
    </SimpleForm>
  </Create>
);

export default ProjectCreate;
