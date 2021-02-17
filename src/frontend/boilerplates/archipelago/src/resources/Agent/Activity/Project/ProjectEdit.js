import React from 'react';
import { ImageInput, SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField } from '@semapps/semantic-data-provider';
import { MarkdownInput } from '@semapps/markdown-components';
import { ActorsInput, DocumentsInput, ThemesInput } from '../../../../pair';
import ProjectTitle from './ProjectTitle';

const ProjectEdit = props => (
  <Edit title={<ProjectTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:homePage" fullWidth />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <ActorsInput source="pair:involves" />
      <DocumentsInput source="pair:documentedBy" />
      <ThemesInput source="pair:hasTopic" />
    </SimpleForm>
  </Edit>
);

export default ProjectEdit;
