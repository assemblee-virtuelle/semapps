import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { UriInput } from '@semapps/react-admin';

const ProjectCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="pairv1:preferedLabel" label="Nom" />
      <MarkdownInput multiline source="pairv1:description" label="Description" fullWidth />
      <UriInput source="pairv1:homePage" label="Site web" />
    </SimpleForm>
  </Create>
);

export default ProjectCreate;
